const { load } = require('js-yaml')

const chunks = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  )

// 主解析函数
const parseMD = (contents) => {
  try {
    const blocks = contents
      .split(/^---$/m)
      .map((block) => block.trim())
      .filter(Boolean)

    if (blocks.length === 1) {
      return [
        {
          metadata: {},
          content: blocks[0],
        },
      ]
    }

    return chunks(blocks, 2).map(([metaBlock, contentBlock = '']) => ({
      metadata: metaBlock ? load(metaBlock) : {},
      content: contentBlock,
    }))
  } catch (error) {
    console.error('Failed to parse markdown:', error)
    return [{ metadata: {}, content: contents }]
  }
}

module.exports = parseMD
