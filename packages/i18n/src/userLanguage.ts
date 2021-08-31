const localStorageLanguageCodeKey = '__lumy_languageCode'

const useUserLanguageCode = (): [Navigator['language'], (code: Navigator['language']) => void] => {
  const code = localStorage.getItem(localStorageLanguageCodeKey) ?? navigator.language
  const setCode = (code: Navigator['language']) => {
    if (code != null) localStorage.setItem(localStorageLanguageCodeKey, code)
    else localStorage.removeItem(localStorageLanguageCodeKey)
  }

  return [code, setCode]
}

export { useUserLanguageCode }
