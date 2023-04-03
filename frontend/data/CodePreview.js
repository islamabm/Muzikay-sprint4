<<<<<<< HEAD
updateBodyBackgroundColor(color) {
  const darkShade = this.getShade(color, 0.07)
  const headerShade = this.getShade(color, 0.4)

  const gradient = `linear-gradient(to bottom, ${color.rgba}, ${headerShade.rgba})`
  const darkGradient = `linear-gradient(to bottom, ${darkShade.rgba} 0%, rgba(0, 0, 0, 1) 30%)`

  document.body.style.backgroundImage = gradient
  this.$refs.stationDetailsHeader.style.backgroundImage = gradient
  this.$refs.bottomHalf.style.backgroundImage = darkGradient
},
getShade(color, shadeLevel) {
 return {
    ...color,
    rgba: `rgba(${Math.round(color.value[0] * shadeLevel)}, ${Math.round(
      color.value[1] * shadeLevel
    )}, ${Math.round(color.value[2] * shadeLevel)}, 0.7)`,
  }
}
=======
// updateBodyBackgroundColor(color) {
//   const darkShade = this.getShade(color, 0.07)
//   const headerShade = this.getShade(color, 0.4)

//   const gradient = `linear-gradient(to bottom, ${color.rgba}, ${headerShade.rgba})`
//   const darkGradient = `linear-gradient(to bottom, ${darkShade.rgba} 0%, rgba(0, 0, 0, 1) 30%)`

//   document.body.style.backgroundImage = gradient
//   this.$refs.stationDetailsHeader.style.backgroundImage = gradient
//   this.$refs.bottomHalf.style.backgroundImage = darkGradient
// },

// getShade(color, shadeLevel) {
//  return {
//     ...color,
//     rgba: `rgba(${Math.round(color.value[0] * shadeLevel)}, ${Math.round(
//       color.value[1] * shadeLevel
//     )}, ${Math.round(color.value[2] * shadeLevel)}, 0.7)`,
//   }
// }

// async getDominantColor(imageSrc) {
//   const cachedColor = this.colorCache[imageSrc]
//   if (cachedColor) {
//     this.updateBodyBackgroundColor(cachedColor)
//     return
//   }
//   const fac = new FastAverageColor()
//   const img = new Image()
//   img.crossOrigin = 'Anonymous'
//   const corsProxyUrl = 'https://api.codetabs.com/v1/proxy?quest='
//   img.src = corsProxyUrl + encodeURIComponent(imageSrc)
//   img.onload = async () => {
//     try {
//       const color = await fac.getColorAsync(img)
//       this.colorCache[imageSrc] = color
//       this.updateBodyBackgroundColor(color)
//     } catch (e) {
//       console.error(e)
//     }
//   }
// },
>>>>>>> 6133e08b4f53264a34fee1fbb748ef7b20d78887
