export const CONFIG = Object.freeze({
  apiUrl: "PASTE_APPS_SCRIPT_WEB_APP_URL",
  siteUrl: "https://worksframe.com",
  brandName: "웍스프레임",
  senderName: "김민선",
  kakaoUrl: "https://open.kakao.com/o/sYTIkUMi",
  phoneUrl: "",
});

export function hasLiveApi() {
  return /^https:\/\/script\.google\.com\//.test(CONFIG.apiUrl);
}
