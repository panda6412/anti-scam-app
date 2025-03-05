const base64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII='
const base64ToFile = (base64: string, filename: string): File => {
  const arr = base64.split(',')
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png'
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

function ShareButton() {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        const file = base64ToFile(base64Image, 'mock-image.png')

        const shareData: ShareData = {
          title: '分享圖片',
          text: '這是要分享的 Base64 圖片！',
          files: [file]
        }

        await navigator.share(shareData)
        console.log('分享成功')
      } catch (error) {
        console.error('分享失敗或取消', error)
      }
    } else {
      alert('你的瀏覽器不支援 Web Share API，請手動分享')
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      alert('連結已複製！')
    } catch (error) {
      console.error('複製失敗', error)
      alert('複製失敗，請手動複製')
    }
  }

  return (
    <div className='share-container'>
      {/* 📌 行動裝置: 使用 Web Share API */}
      <button onClick={handleShare} className='share-button'>
        📤 分享
      </button>

      {/* 📌 桌機或不支援 Web Share API: 手動分享選項 */}
      <div className='manual-share'>
        {/* <a
          href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareData.url)}`}
          target='_blank'
          rel='noopener noreferrer'
          className='share-link'
        >
          🟢 分享到 LINE
        </a>
        <a
          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareData.text + ' ' + shareData.url)}`}
          target='_blank'
          rel='noopener noreferrer'
          className='share-link'
        >
          🟢 分享到 WhatsApp
        </a> */}
        <button onClick={handleCopyLink} className='copy-button'>
          📋 複製連結
        </button>
      </div>

      <style>{`
        .share-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        .share-button, .copy-button {
          padding: 10px 15px;
          font-size: 16px;
          cursor: pointer;
          border: none;
          background-color: #007bff;
          color: white;
          border-radius: 5px;
        }
        .manual-share {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .share-link {
          text-decoration: none;
          padding: 8px;
          border-radius: 5px;
          background-color: #25d366;
          color: white;
          font-size: 16px;
          text-align: center;
          display: block;
        }
      `}</style>
    </div>
  )
}

export default ShareButton
