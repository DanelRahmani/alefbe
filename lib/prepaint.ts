// Runs in <head> before first paint: copies the saved display settings onto
// <html data-vowels data-translit data-theme>, so a reload shows the chosen
// vowel-mark mode and transliteration straight away (no flash). The static
// HTML ships the defaults; CSS keys every mode off these attributes.

export const SETTINGS_KEY = "alefbe2:settings";

export const PREPAINT_SCRIPT = `(function(){try{var r=localStorage.getItem(${JSON.stringify(
  SETTINGS_KEY,
)});if(!r)return;var s=JSON.parse(r).data;if(!s)return;var d=document.documentElement;if(s.vowels==="all"||s.vowels==="key"||s.vowels==="none")d.dataset.vowels=s.vowels;d.dataset.translit=s.translit?"on":"off";if(s.theme==="light"||s.theme==="dark"||s.theme==="system")d.dataset.theme=s.theme;}catch(e){}})();`;
