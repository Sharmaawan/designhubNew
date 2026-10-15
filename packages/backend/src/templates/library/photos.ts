import { image, type LibraryElement } from './types.js'
// Licensed Pixabay photos (Pixabay License: free for commercial use, no attribution required).
// Generated from the photo selection run. Each entry is the 1280 px rendition the API returns.
export interface Photo { src: string; w: number; h: number; by: string; page: string }
export const PHOTOS: Record<string, Photo> = {
  coffee: { src: "https://pixabay.com/get/gedfabda06b8117aabe3c7985d7e13b275efd08ec18a072eb86d7a40b18d03eda1cab81157817f6266e13eab8646cdb739d5b1bbd34155d0c98a6a7df9676aa97_1280.jpg", w: 1280, h: 960, by: "JessBaileyDesign", page: "https://pixabay.com/photos/coffee-cup-drink-breakfast-food-3200073/" },
  mountain: { src: "https://pixabay.com/get/ga123f62f92fe0faa5e93fff16e022947b435ae6513ccad956f7a182e9dcb19c7b3b2acd8ff49ea641ce1f95b09fd2aef629b27af7c56f0771836593ce7770011_1280.jpg", w: 1280, h: 862, by: "jameswheeler", page: "https://pixabay.com/photos/alberta-canada-lake-mountains-2297204/" },
  office: { src: "https://pixabay.com/get/g5320c9c64d80eb88841ff832a495714f56e412b3866e2a077bf442093378ff23ad0c48b9c72a68c3f2d374cbe3d66681a7db73da5d81b05e9e58f3bf472a5347_1280.jpg", w: 1280, h: 853, by: "Pexels", page: "https://pixabay.com/photos/apple-computer-desk-workspace-1868496/" },
  concrete: { src: "https://pixabay.com/get/g62592a0edd51400e7724076f978f1aa7bc837bad9605974a39bb74f3523e606d4cceba2ef1e860cee523a8e90fc31004bc3f6fa9a6a3054abb9943d5f25aa7d2_1280.jpg", w: 1280, h: 640, by: "PIRO4D", page: "https://pixabay.com/photos/reside-bedroom-architecture-modern-3104077/" },
  flowers: { src: "https://pixabay.com/get/gc0afe81023f545716c90b61be11bddc7fd3236bd8c1ed275107f724295b5746ad73485e901626f1c0ad06c8e00ba51183a3d1243edbe2c0959be74daa00893ce_1280.jpg", w: 1280, h: 853, by: "MariLari", page: "https://pixabay.com/photos/insect-entomology-butterfly-8340649/" },
  yoga: { src: "https://pixabay.com/get/g4a9f0c45dd5368c36afb947cba1af5d24ce0d62d192fb9327c27b6518a202febd7afda1239e42ee0204f43c260349ac7c1f94726bb9d792d2c50b59c30562930_1280.jpg", w: 1280, h: 960, by: "Engin_Akyurt", page: "https://pixabay.com/photos/woman-yoga-sport-peace-freedom-7338352/" },
  citylights: { src: "https://pixabay.com/get/g6ea037f25f2013f883959bcf8aabc9235cd598f9eb7e6ec1e40a78fd1f6950f5bd50e6ea3a30ab184fa7e08b9cf98ba3b5cf63c4ed944f17e5f65d44f4627874_1280.jpg", w: 1280, h: 853, by: "cordallman", page: "https://pixabay.com/photos/woman-lights-fashion-model-9193216/" },
  ceramic: { src: "https://pixabay.com/get/g99712842747e1888690d510e691858701cf5fdb385be38ba74ff5828a8b2d9f88fd4958ad7dcb8fb2c962a9bb1013d59a7a7b23377acc68abef310a357af213b_1280.jpg", w: 1280, h: 720, by: "LubosHouska", page: "https://pixabay.com/photos/clay-pottery-hands-potter-1139098/" },
  sneaker: { src: "https://pixabay.com/get/g4bb2cf9a80fa639c61b380c9a5840d458f1fc673e2fb6b509b04d9ed12e33ab2dbf288134d2d012a5f58188d6d79d226be91abfc873c943acd3d41325b601f73_1280.jpg", w: 1280, h: 853, by: "stux", page: "https://pixabay.com/photos/running-shoe-shoe-brooks-371625/" },
  salad: { src: "https://pixabay.com/get/gd10f78a3874c43d21a8cee606b61433c7d0d1c96b68ee33cfcd1fcbcf831268a2148eeb3a347caab0bb8b3baac26799200a4d97b3c22fc3bdc431d9fd5d23a90_1280.jpg", w: 1280, h: 853, by: "Kost9n4", page: "https://pixabay.com/photos/top-view-basil-herbs-bowl-closeup-1248955/" },
  car: { src: "https://pixabay.com/get/g98f9ceb66141ebbae811ae3a8de592fa6f82c3884efd05c9782a51e527c52c08e573504270cc558841c43de346e47e5f681b03dfad1835ad450eac9f8f3c4251_1280.jpg", w: 1280, h: 720, by: "pgottschalk", page: "https://pixabay.com/photos/coupe-limousine-car-black-car-auto-1374450/" },
  laptop: { src: "https://pixabay.com/get/g6484cd5fdfdc81b0f445302b16ce07a42a85ecefb8f0c6fd790e8f08c0848d099fb38a2b28cd472e61ef68c760ee87b6ee752427b1676b2f495c6d59b9546b5d_1280.jpg", w: 1280, h: 851, by: "freephotocc", page: "https://pixabay.com/photos/cup-of-coffee-laptop-office-macbook-1280537/" },
  forest: { src: "https://pixabay.com/get/gcac0bfaa1b83219a974ba9b5cc269a73e0b81b36c2aa6ba4171d056d16d30c837e4766a54ad452ade576d0c7a4c293c282bbfc648f464755242faf58c1f8d086_1280.jpg", w: 1280, h: 853, by: "jplenio", page: "https://pixabay.com/photos/trees-field-trail-pathway-path-5691803/" },
  jewelry: { src: "https://pixabay.com/get/ga7891adb63ae497f96441c57d1884ec7fa923d305284c32ae0c4bca21b3510ff7ad8fe2f82af0ebc08e6fed316dd5800bccb495535b41dd8ddef2d67407f1cdb_1280.jpg", w: 1280, h: 855, by: "Pezibear", page: "https://pixabay.com/photos/chain-gold-human-girl-woman-9789500/" },
  beach: { src: "https://pixabay.com/get/g4e04b09c9355088ea5cb253e63322f8d8890d1db3a237c05c57c561bb3176602147ef8073246e3a1a7a45f6440d7e646aac6715391d4bac547b9525efde14789_1280.jpg", w: 1280, h: 720, by: "kirildobrev", page: "https://pixabay.com/photos/blue-beach-surf-travel-surfer-4145659/" },
  cafe: { src: "https://pixabay.com/get/g4da16eb15178701c90e48cb311ff7e4ef2e8152f159905eac9003fe2f1681e1be26ee0dd8c9df3d0d0176d2c2528f8f41dfb8e1d5e25300af0f4e21736b80100_1280.jpg", w: 1280, h: 853, by: "Pexels", page: "https://pixabay.com/photos/brick-wall-chairs-furniture-1834784/" },
  tools: { src: "https://pixabay.com/get/ge38443dee90f4c8d6328d54f4b511256f707f62ddfae93d851b7211aeb9df7c1ee5f6bc5645643e70973a99612395f14b8fe352f6ea4b851813782413bcb87b4_1280.jpg", w: 1280, h: 853, by: "stevepb", page: "https://pixabay.com/photos/confused-muddled-illogical-880735/" },
  plant: { src: "https://pixabay.com/get/gc54efbb02345b7cabee2795724dafffb3aa68e619724c12a814fa3d6ae5007686e344f0ee12a0f6b327e53a2a8f22b2880d2d2644ab485a3fc64ab7bb0a63a13_1280.jpg", w: 1280, h: 720, by: "BR7749", page: "https://pixabay.com/photos/monstera-deliciosa-plant-leaves-9299206/" },
  running: { src: "https://pixabay.com/get/g31ea52df05ff5395931294dad0a286fe0a8fbad3e31a01e3f702ca80d7e9324e82dc0ed8b634a76fe1991a56413f62e4d2ffccab86ec52204d87c82169c7b964_1280.jpg", w: 1280, h: 852, by: "Pexels", page: "https://pixabay.com/photos/beach-people-running-pair-waves-1850248/" },
  book: { src: "https://pixabay.com/get/g90c0cc5b0d26ae418b4af4bc07ee243bc4556baadc27e848e7d6aaff3b15daa794c21e2e2d589d1efeb1e05f8b3924a7201e724881c877896c93a854d47a2606_1280.jpg", w: 1280, h: 1013, by: "stevepb", page: "https://pixabay.com/photos/light-lamp-bedside-lamp-465350/" },
  bike: { src: "https://pixabay.com/get/gdaf6c4ce8ed0dfd2520680356fd5482ae2387b11dee5228736ecfb331017ba0cf7e3a800d9f7de89f26311831e743ba219629e3ca4c140b29862c66b99d71b5b_1280.jpg", w: 1280, h: 912, by: "Engin_Akyurt", page: "https://pixabay.com/photos/bicycle-children-graffiti-art-3045580/" },
  cosmetic: { src: "https://pixabay.com/get/g2a759a1d07e58f81d48389d56064efb373e65d439a52d437dcdc9edabcf5fcc67996ae93fb19f112cb7df9a3527b45eaacf03f102d8b9aca79dfe3c7eaa1fb82_1280.jpg", w: 1280, h: 853, by: "stevepb", page: "https://pixabay.com/photos/massage-therapy-essential-oils-1612308/" },
  chef: { src: "https://pixabay.com/get/g374c0c934b2f55c8e671588f82216919cee108bc11678ab0d58ee3e5c8ab2fb69b31cac19040b2b30413dd5068d6703f4cf6e5326487547b1258e995e52fa049_1280.jpg", w: 1280, h: 853, by: "Pexels", page: "https://pixabay.com/photos/restaurant-cooking-chef-kitchen-1284351/" },
  desert: { src: "https://pixabay.com/get/g0c923ceffa31baa39ae55636fff8d4f8d7c53741606fb98e9830752c3835bc12e795de49331841dfd83da38cd8375dad5659ba9216611437210810b85d03ca3f_1280.jpg", w: 1280, h: 960, by: "Pezibear", page: "https://pixabay.com/photos/desert-sand-barren-dry-arid-790640/" },
  neon: { src: "https://pixabay.com/get/gcfc45c4ff1ebcfd3323e71f7645b3833f7f7eb644b71ea973415542f2dc6192c6b81a5ab3bdfbbd96cf9e2da92f657f6ac7924bd42bba7cbd0d54392825950fb_1280.jpg", w: 1280, h: 960, by: "merlinlightpainting", page: "https://pixabay.com/photos/abstract-painting-feathers-6047465/" },
  marble: { src: "https://pixabay.com/get/g7a06a5c185e6313e2d8b742a8913d034824acea4a470c169c2cc068af864906af89b9b6bbcd49200e0e792bc3ab7e546d775ab71818c8844fe53ed96de809141_1280.jpg", w: 1280, h: 853, by: "AnthonyArnaud", page: "https://pixabay.com/photos/concept-abstract-painting-artwork-5183469/" },
  garba: { src: "https://pixabay.com/get/ge74f1e94386d70076e0447765678cc49422d9e6238372b71c306c856b034e6a596a5937c73648bde3675ecd948020daddf2935b05d7f6d714903f12726966ed8_1280.jpg", w: 1280, h: 853, by: "murtaza_ali", page: "https://pixabay.com/photos/holi-girl-indian-india-dance-fun-2416686/" },
  dandiya: { src: "https://pixabay.com/get/ge138f183efe096daa0dd8c07de4f42090a80ce5717ce70618d7198e399794f6011d3ffeac8460de733bb1a1e6d5392e0_1280.jpg", w: 1280, h: 851, by: "weinstock", page: "https://pixabay.com/photos/cinnamon-spice-food-cinnamon-stick-92594/" },
  durga: { src: "https://pixabay.com/get/g202e657964058f547049f408611a46df42a7e9174377856b1b5fd06d0bbc81240e328aefede9d7a6a65b3fe4efa11f4547f6e07e492da2b0c3b5d0ab4bf96bba_1280.jpg", w: 1280, h: 960, by: "Hans", page: "https://pixabay.com/photos/easter-eggs-multicoloured-3032058/" },
  marigold: { src: "https://pixabay.com/get/gfca66b9d49b41396a3c8f15b863daf59ee7a88eaed505cd43efdc6f311f802762ec13d61d0cae57cd49d462099a2af527ec19ee7a0976e1fd9cbebece78f78df_1280.jpg", w: 1280, h: 853, by: "SophiaMartin", page: "https://pixabay.com/photos/marigold-flowers-plants-8281782/" },
  diya: { src: "https://pixabay.com/get/g460a0aabd66ea29f0e245b5db71885094ae9173ccf39fdd4f8add6ff28f10d3cb98d3acce58954247aa17bc2d478cbcf48042b3878d19b151c4d27eddf4f63d7_1280.jpg", w: 1280, h: 853, by: "kalyanayahaluwo", page: "https://pixabay.com/photos/pahan-oil-lamp-light-illuminate-7439926/" },
  rangoli: { src: "https://pixabay.com/get/g8475b6f3395e26f3321bb153b6b34e068c07e412e542651aaa9e1161d426b4b96f5e0dcbad8b8af0b676ef4028680308c390f61ae77c1955701ac6246fc829f7_1280.jpg", w: 1280, h: 853, by: "Moroznaya_Photo", page: "https://pixabay.com/photos/paint-artist-supplies-art-creation-7937871/" },
  drum: { src: "https://pixabay.com/get/gfcc3f07a5dc8cad7a055cd3338dd113b94735568b6599cac547b4e12dc5f9470311f99a0d8a44db0ae9e4c42f11d905372e19ab208c44e8a86a7a3b0d1bd77cd_1280.jpg", w: 1280, h: 852, by: "bongbabyhousevn", page: "https://pixabay.com/photos/tet-baby-drum-traditional-costume-9948611/" },
  lamps: { src: "https://pixabay.com/get/gb0c0ccf8974fc7d06d192cfdc9833218cb5418df32ff33ce021690f60630f3d72e2208c1e0fe75e9fa609c9c25b917503b1fe5714f4d12d5fe36d8499775dd33_1280.jpg", w: 1280, h: 861, by: "wal_172619", page: "https://pixabay.com/photos/chinese-lanterns-restaurant-lamps-7591296/" },
  garbaSkirts: { src: "https://pixabay.com/get/g056be4b8dc0ea45a13a633c274adc5f2440373ebadbc8da3ce0d1a4ab9723cd5dbda559d8054f9402b30c390300b2a4e52d89778d4ab67de90eeef62e7cb1e72_1280.jpg", w: 1280, h: 853, by: "picsbyjameslee", page: "https://pixabay.com/photos/4705290/" },
  redDress: { src: "https://pixabay.com/get/g23b0260fd17ffb05b3c348debf71d7c21e90d9c58cd59924609637a108f46cbc55d29212c62ed3e99e76d00925a7cb62822eb7898da5626212f302680b5df1ba_1280.jpg", w: 1280, h: 853, by: "AdinaVoicu", page: "https://pixabay.com/photos/1505407/" },
}

/**
 * Centre-crops a photo to the frame's aspect ratio, in natural pixels, as the editor's crop expects.
 * `focus` moves the crop window (0 = left/top edge, 1 = right/bottom edge).
 */
export function photoCrop(key: string, width: number, height: number, focus = { x: 0.5, y: 0.5 }) {
  const p = PHOTOS[key]
  if (!p) throw new Error(`Unknown photo ${key}`)
  const target = width / height
  if (p.w / p.h > target) {
    const cw = Math.round(p.h * target)
    return { src: p.src, w: p.w, h: p.h, crop: { x: Math.round((p.w - cw) * focus.x), y: 0, width: cw, height: p.h } }
  }
  const ch = Math.round(p.w / target)
  return { src: p.src, w: p.w, h: p.h, crop: { x: 0, y: Math.round((p.h - ch) * focus.y), width: p.w, height: ch } }
}

/** A photo element sized to a frame, with an optional corner radius (use half the width for a circle). */
export function photoImage(key: string, x: number, y: number, width: number, height: number, opts: { focus?: { x: number; y: number }; radius?: number } = {}): LibraryElement {
  const c = photoCrop(key, width, height, opts.focus)
  const el = image(x, y, width, height, c.src, c.w, c.h, c.crop)
  if (opts.radius) el.data.cornerRadius = opts.radius
  return el
}
