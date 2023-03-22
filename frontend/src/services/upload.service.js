// export const uploadService = {
//   uploadImg
// }
// async function uploadImg(ev) {
//   const CLOUD_NAME = "dcwibf9o5"
//   const UPLOAD_PRESET = "vt0iqgff"
//   const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

//   try {
//     const formData = new FormData()
//     formData.append('upload_preset', UPLOAD_PRESET)
//     formData.append('file', ev.target.files[0])

//     const res = await fetch(UPLOAD_URL, {
//       method: 'POST',
//       body: formData
//     })
//     const imgUrl = await res.json()
//     return imgUrl
//   } catch (err) {
//     console.error('Failed to upload', err)
//     throw err
//   }
// }
const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET
const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

export const uploadImg = async (file) => {
  const FORM_DATA = new FormData()

  FORM_DATA.append('file', file)
  FORM_DATA.append('upload_preset', UPLOAD_PRESET)

  try {
    const res = await fetch(UPLOAD_URL, {
      method: 'POST',
      body: FORM_DATA,
    })
    return res.json()
  } catch (err) {
    console.dir(err)
  }
}
