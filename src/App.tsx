import { FormEvent, useCallback, useRef, useState, VFC } from 'react'
import './App.css'
import useCanvas from './hooks/useCanvas'
import { useFileReader } from './hooks/useFileReader'
import { useWebShareApi } from './hooks/useWebShareApi'

const App: VFC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const inputFileRef = useRef<HTMLInputElement>(null)

  const [titleText, setTitleText] = useState<string>('ここにtitleを入れる')
  const [shareText, setShareText] = useState<string>('ここにシェアしたいテキストをいれる')
  const [urlText, setUrlText] = useState<string>('https://web-share-api-250e9.web.app/')

  const [shareImageMethod, setShareImageMethod] = useState<string | null>(null)

  const {
    share,
    isNotSupportWebShareApi,
    isNotSupportNavigatorCanShare,
    canShare,
    canImageShare,
    errorText,
  } = useWebShareApi()

  const { result, error, file, loading, setFile } = useFileReader()

  const onInputFile = (e: FormEvent<HTMLInputElement>) => {
    const { target } = e
    if (!(target instanceof HTMLInputElement)) {
      return
    }
    if (!target.files) return
    setFile(target.files[0])
  }

  const { toFiles } = useCanvas({
    canvas: canvasRef,
    title: titleText,
    text: shareText,
    url: urlText,
  })

  const prepareShare = useCallback(async () => {
    if (loading) return
    let files: File[] = []
    if (shareImageMethod === 'canvas') {
      files = await toFiles()
    }

    if (shareImageMethod === 'file') {
      if (!file) return
      files = [file]
    }

    if (shareImageMethod === 'video') {
      if (!file) return
      files = [file]
    }

    const shareData = { title: titleText, text: shareText, url: urlText, files }
    await share(shareData)
  }, [file, loading, share, shareImageMethod, shareText, titleText, toFiles, urlText])

  return (
    <div className="App">
      <header className="App-header">
        {/* 検証 */}
        <section className="api-test-wrap">
          <p className="title">Web Share Test</p>
          <div className="input-wrap">
            <p className="text bold">・Title</p>
            <input
              className="input text"
              type="text"
              defaultValue={titleText}
              onChange={(e) => setTitleText(e.target.value)}
            />
          </div>
          <div className="input-wrap">
            <p className="text bold">・Text</p>
            <input
              className="input text"
              type="text "
              defaultValue={shareText}
              onChange={(e) => setShareText(e.target.value)}
            />
          </div>
          <div className="input-wrap">
            <p className="text bold">・URL</p>
            <input
              className="input text"
              type="text"
              defaultValue={urlText}
              onChange={(e) => setUrlText(e.target.value)}
            />
          </div>

          <div className="images">
            <p className="text bold">・添付画像</p>
            {/* canvas */}
            <div className="radio-wrap">
              <input
                type="radio"
                id="canvas"
                name="shareImage"
                value="canvas"
                onChange={() => setShareImageMethod('canvas')}
              />
              <label className="text" htmlFor="canvas">
                canvas imageから画像を生成してシェア
              </label>

              <canvas ref={canvasRef} className="canvas" width="1200" height="630" />
            </div>

            {/* 画像 */}
            <div className="radio-wrap radio-wrap--2">
              <input
                type="radio"
                id="file"
                name="shareImage"
                value="file"
                onChange={() => setShareImageMethod('file')}
              />
              <label className="text" htmlFor="file">
                ファイルをアップロードしてシェア（画像、動画）
              </label>

              <div className="file">
                <input
                  className="input-file"
                  ref={inputFileRef}
                  type="file"
                  accept="image/png, image/jpeg, video/*"
                  onInput={onInputFile}
                />
              </div>
            </div>

            {result?.indexOf('data:image') === 0 && (
              <div className="input-image-preview" style={{ background: `url(${result})` }} />
            )}

            {result?.indexOf('data:video') === 0 && (
              <video className="input-image-preview" src={result} muted playsInline autoPlay loop />
            )}
          </div>

          <button className="button" type="submit" onClick={prepareShare}>
            シェアする
          </button>
          <div className="cautions">
            {isNotSupportWebShareApi && (
              <p className="text caution">※Web Share APIに対応していない</p>
            )}
            {isNotSupportNavigatorCanShare && (
              <p className="text caution">※Web Share APIのバリデーション機能に対応していない</p>
            )}
            {!canShare && (
              <p className="text caution">※バリデーションに失敗、不要なデータもしくは形式</p>
            )}
            {!canImageShare && <p className="text caution">※画像のシェアに対応していない</p>}
            <p className="text caution">{errorText}</p>
            <p className="text caution">{error?.message}</p>
          </div>
        </section>

        {/* 説明 */}
        <section className="info">
          <p className="title">Navigator.shareについて</p>
          <a
            className="link"
            href="https://developer.mozilla.org/ja/docs/Web/API/Navigator/share"
            target="_blank"
            rel="noreferrer"
          >
            Navigator.share() MDN
          </a>
          <a
            className="link"
            href=" https://w3c.github.io/web-share/"
            target="_blank"
            rel="noreferrer"
          >
            Web Share API W3C Editors Draft 22 November 2021
          </a>
          <img className="image" src="./support.png" alt="" />

          <p className="title">Web Share API Level 2について</p>
          <a
            className="link"
            href="https://chromestatus.com/feature/4777349178458112"
            target="_blank"
            rel="noreferrer"
          >
            Feature: Web Share API Level 2
          </a>
          <p className="text">
            Web Share API Level
            2は、Web上からユーザーが選択したアプリにファイルを共有することができます。このAPIにより、ウェブ開発者はネイティブアプリケーションで使用されているのと同じシステム共有ダイアログボックスを表示する共有ボタンを作成することができます。レベル1では、システム共有ダイアログを表示することができましたが、これまではテキストとURLのみしか共有できませんでした。
          </p>
        </section>
      </header>
    </div>
  )
}

export default App
