import { Routes } from 'web/src/navigation/Routes';

export function render(text: string, rawText: string, refUrl: string) {
  const shareText = getText(text);
  const url = getTwitterShareUrl(shareText, refUrl);
  return (
        // tslint:disable:max-line-length
        `<a href="${url}" data-text="${rawText}" data-url="${refUrl}" target="_blank" rel="noopener nofollow noreferrer">
        <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-bottom:3px;">
          <path d="M17.25 1.25C16.5318 1.75661 15.7366 2.14409 14.895 2.3975C14.4433 1.87814 13.843 1.51002 13.1753 1.34295C12.5076 1.17587 11.8046 1.2179 11.1616 1.46334C10.5185 1.70879 9.96633 2.1458 9.57974 2.71529C9.19314 3.28478 8.99077 3.95926 9 4.6475V5.3975C7.68198 5.43168 6.37596 5.13936 5.19826 4.54659C4.02056 3.95381 3.00774 3.07898 2.25 2C2.25 2 -0.75 8.75 6 11.75C4.4554 12.7985 2.61537 13.3242 0.75 13.25C7.5 17 15.75 13.25 15.75 4.625C15.7493 4.41609 15.7292 4.2077 15.69 4.0025C16.4555 3.24762 16.9956 2.29454 17.25 1.25Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        </a>`
  );
}
const CHAR_LIMIT = 260;
export function getText(text: String) {
  let chunk = text.trim(); // removes the trailing and leading whitespace

  // if highlighted text is over CHAR_LIMIT,
  // we will trim it after CHAR_LIMIT and put a "..." (unicode 2026).
  if (chunk.length > CHAR_LIMIT - 2) {
    chunk = chunk.slice(0, CHAR_LIMIT - 3).trim() + '\u2026';
  }
  return chunk;
}
export function getTwitterShareUrl(text: string, refUrl: string) {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(refUrl)}`;
}
export function action(event: MouseEvent, item: HTMLElement) {
  event.preventDefault();
  const trigger = item.querySelector('a');
  if (!trigger) return;
  const dataset = trigger.dataset;
  if (!dataset) return;
  fetch(`/api/v1/highlights`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      highlighted_url: dataset.url,
      text: dataset.text,
    }),
  })
  .then((response: any) => response.json())
  .then((response: any) => {
    const w = item.ownerDocument ? item.ownerDocument.defaultView : null;
    if (!w) return;
    const url = dataset.url;
    if (!url) return;
    const popup = w.open(
        getTwitterShareUrl(
            `\u201c${getText(response.data.text)}\u201d`, `${url}${Routes.HIGHLIGHT}${response.data.id}`,
            ),
            'highlighter',
            'height=440,location=no,menubar=no,scrollbars=no,status=no,toolbar=no,width=640',
            );
    if (popup !== null) {
      popup.opener = null;
    }
  })
  .catch((error: any) => {
    console.error(error);
  });
}
export const name = 'twitter-sharer';
