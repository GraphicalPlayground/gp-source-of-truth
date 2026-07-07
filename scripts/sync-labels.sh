#!/bin/bash

ORG="GraphicalPlayground"
LABELS_FILE="../data/labels.yml"
CLEAR_FIRST=false

for arg in "$@"; do
    case "$arg" in
        --clear|-c) CLEAR_FIRST=true ;;
        --help|-h)
            echo "Usage: $0 [--clear|-c]"
            echo ""
            echo "  --clear, -c    Delete ALL existing labels before syncing"
            echo "  --help,  -h    Show this help message"
            exit 0
            ;;
        *) echo "Unknown option: $arg"; echo "Run '$0 --help' for usage."; exit 1 ;;
    esac
done

set -e

if ! command -v gh &> /dev/null; then echo "Error: 'gh' (GitHub CLI) is not installed."; exit 1; fi
if ! command -v jq &> /dev/null; then echo "Error: 'jq' is not installed."; exit 1; fi
if ! command -v yq &> /dev/null; then 
    echo "Error: 'yq' is required to parse the YAML file."
    echo "Install it via 'brew install yq' (macOS) or your Linux package manager."
    exit 1
fi

echo "Verifying GitHub CLI authentication..."
gh auth status >/dev/null 2>&1 || { echo "Error: Please run 'gh auth login' first."; exit 1; }

if [[ ! -f "$LABELS_FILE" ]]; then
    echo "Error: Could not find file '$LABELS_FILE'."
    exit 1
fi

echo "Parsing $LABELS_FILE..."
EXPECTED_LABELS_JSON=$(yq -o=json '.' "$LABELS_FILE" 2>/dev/null || yq '.' "$LABELS_FILE")

readarray -t EXPECTED_NAMES < <(echo "$EXPECTED_LABELS_JSON" | jq -r '.[].name')

if [ ${#EXPECTED_NAMES[@]} -eq 0 ]; then
    echo "Error: No labels found in $LABELS_FILE, or the format is incorrect."
    exit 1
fi

echo "Fetching all repositories for organization: $ORG..."
readarray -t REPOS < <(gh repo list "$ORG" --limit 1000 --json nameWithOwner --jq '.[].nameWithOwner')

for REPO in "${REPOS[@]}"; do
    echo "========================================"
    echo "Synchronizing labels for: $REPO"

    CURRENT_LABELS_JSON=$(gh label list --repo "$REPO" --limit 500 --json name,color,description)
    readarray -t CURRENT_LABELS < <(echo "$CURRENT_LABELS_JSON" | jq -r '.[].name')

    if [[ "$CLEAR_FIRST" == true ]]; then
        echo "  [!] Clearing all existing labels..."
        for CURRENT_LABEL in "${CURRENT_LABELS[@]}"; do
            if [[ -z "$CURRENT_LABEL" ]]; then continue; fi
            set +e
            gh label delete "$CURRENT_LABEL" --repo "$REPO" --yes 2>/dev/null
            set -e
        done
    else
        for CURRENT_LABEL in "${CURRENT_LABELS[@]}"; do
            if [[ -z "$CURRENT_LABEL" ]]; then continue; fi

            MATCH=$(echo "$EXPECTED_LABELS_JSON" | jq -r --arg name "$CURRENT_LABEL" 'map(select(.name == $name)) | length')

            if [[ "$MATCH" -eq 0 ]]; then
                echo "  [-] Deleting deprecated label: '$CURRENT_LABEL'"
                set +e
                gh label delete "$CURRENT_LABEL" --repo "$REPO" --yes
                set -e
            fi
        done
    fi

    echo "  [+] Creating/Updating labels from $LABELS_FILE..."

    echo "$EXPECTED_LABELS_JSON" | jq -c '.[]' | while read -r label; do
        NAME=$(echo "$label" | jq -r '.name')
        COLOR=$(echo "$label" | jq -r '.color | sub("^#"; "")')
        DESC=$(echo "$label" | jq -r '.description // ""')

        EXISTING=$(echo "$CURRENT_LABELS_JSON" | jq -c --arg name "$NAME" 'map(select(.name == $name)) | first // empty')

        if [[ -n "$EXISTING" ]]; then
            EXISTING_COLOR=$(echo "$EXISTING" | jq -r '.color')
            EXISTING_DESC=$(echo "$EXISTING" | jq -r '.description // ""')

            if [[ "$EXISTING_COLOR" == "$COLOR" && "$EXISTING_DESC" == "$DESC" ]]; then
                echo "      Skipped (unchanged): '$NAME'"
                continue
            fi
        fi

        set +e
        gh label create "$NAME" --repo "$REPO" --color "$COLOR" --description "$DESC" --force >/dev/null 2>&1

        if [[ $? -eq 0 ]]; then
            echo "      Synced: '$NAME'"
        else
            echo "      Failed to sync: '$NAME' (Check permissions or API rate limits)"
        fi
        set -e
    done

    sleep 1
done

echo "========================================"
echo "Synchronization complete!"
