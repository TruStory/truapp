import copy from 'copy-to-clipboard';
import { truToast } from 'shared/components/Toast/TruToast';
import { Routes } from 'web/src/navigation/Routes';

export function render(text: string, rawText: string, refUrl: string) {
  return (
        // tslint:disable:max-line-length
        `<a href="${refUrl}" data-text="${text}" data-url="${refUrl}" target="_blank" rel="noopener nofollow noreferrer">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-bottom:3px;">
            <path d="M7.45752 9.70017C7.77961 10.1308 8.19054 10.4871 8.66243 10.7449C9.13433 11.0027 9.65615 11.156 10.1925 11.1944C10.7289 11.2328 11.2672 11.1554 11.771 10.9675C12.2748 10.7796 12.7324 10.4855 13.1125 10.1052L15.3625 7.85517C16.0456 7.14791 16.4236 6.20065 16.415 5.21741C16.4065 4.23418 16.0121 3.29363 15.3168 2.59835C14.6216 1.90307 13.681 1.50869 12.6978 1.50014C11.7145 1.4916 10.7673 1.86958 10.06 2.55267L8.77002 3.83517" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10.4577 8.20018C10.1356 7.76958 9.72465 7.41329 9.25276 7.15548C8.78086 6.89766 8.25904 6.74434 7.72268 6.70593C7.18632 6.66752 6.64798 6.74491 6.14416 6.93284C5.64034 7.12078 5.18283 7.41488 4.80267 7.79518L2.55267 10.0452C1.86958 10.7524 1.4916 11.6997 1.50014 12.6829C1.50869 13.6662 1.90307 14.6067 2.59835 15.302C3.29363 15.9973 4.23418 16.3917 5.21741 16.4002C6.20065 16.4088 7.14791 16.0308 7.85517 15.3477L9.13767 14.0652" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </a>`

  );
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
    const url = dataset.url;
    if (!url) return;
    copy(`${url}${Routes.HIGHLIGHT}${response.data.id}`);
    truToast('Link Copied to Clipboard');
  })
  .catch((error: any) => {
    console.error(error);
  });
}
export const name = 'clipboard-sharer';
