export function shareToTwitter(text: string, url: string) {
  window.open(
    `https://twitter.com/intent/tweet?text=\u201c${encodeURIComponent(text)}\u201d&url=${encodeURIComponent(url)}`,
    'argument-sharer',
    'height=440,location=no,menubar=no,scrollbars=no,status=no,toolbar=no,width=640',
    );
}

export function shareToFacebook(text: string, url: string) {
  window.open(
    `http://www.facebook.com/sharer.php?u=${encodeURIComponent(url)}&p[title]=\u201c${encodeURIComponent(text)}\u201d`,
    'argument-sharer',
    'height=440,location=no,menubar=no,scrollbars=no,status=no,toolbar=no,width=640',
    );
}

export function shareToLinkedin(text: string, url: string) {
  window.open(
    `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=\u201c${encodeURIComponent(text)}\u201d`,
    'argument-sharer',
    'height=440,location=no,menubar=no,scrollbars=no,status=no,toolbar=no,width=640',
    );
}

export function shareToReddit(text: string, url: string) {
  window.open(
    `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=\u201c${encodeURIComponent(text)}\u201d`,
    'argument-sharer',
    'height=440,location=no,menubar=no,scrollbars=no,status=no,toolbar=no,width=640',
    );
}
