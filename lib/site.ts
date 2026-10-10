export const REPO = "aaronanish-t/commitcamp";
export const REPO_URL = `https://github.com/${REPO}`;
export const BRANCH = "main";

/**
 * GitHub's "create new file" page, pre-filled. Opening it on a repo you can't
 * push to makes GitHub offer to fork it and open a PR — so a first
 * contribution needs no local setup at all.
 */
export function newFileUrl(dir: string, filename: string) {
  return `${REPO_URL}/new/${BRANCH}/${dir}?filename=${encodeURIComponent(filename)}`;
}

export function editFileUrl(file: string) {
  return `${REPO_URL}/edit/${BRANCH}/${file}`;
}
