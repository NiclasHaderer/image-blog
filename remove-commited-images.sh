 #!/bin/bash

# Get the list of image files to be removed
IMAGE_FILES=$(git diff-tree --no-commit-id --name-only -r HEAD | grep -E '\.(png|jpg|jpeg|gif|bmp|ico|webp)$')

# Remove the image files from the index
for FILE in $IMAGE_FILES; do
    git rm --cached $FILE
done

# Amend the last commit with the changes
git commit --amend -C HEAD --no-verify

echo "Image files removed from the last local commit."
