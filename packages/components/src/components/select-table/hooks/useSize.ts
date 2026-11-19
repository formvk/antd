import type { SizeType } from 'antd/es/config-provider/SizeContext'

interface ISize {
  (
    fieldSize: SizeType,
    searchSize: SizeType | undefined,
    tableSize: SizeType | undefined
  ): {
    searchSize: SizeType
    tableSize: SizeType
  }
}

// 纯函数，故不使用 use 前缀命名
const getSize: ISize = (fieldSize = 'middle', searchSize, tableSize) => {
  // antd v6 移除 'default' 尺寸，历史 default 归一到 middle；large 表格尺寸同样取 middle
  const fieldSizeMap: Record<string, { searchSize: SizeType; tableSize: SizeType }> = {
    small: {
      searchSize: 'small',
      tableSize: 'small',
    },
    default: {
      searchSize: 'middle',
      tableSize: 'middle',
    },
    middle: {
      searchSize: 'middle',
      tableSize: 'middle',
    },
    large: {
      searchSize: 'large',
      tableSize: 'middle',
    },
  }
  const { searchSize: fieldSearchSize, tableSize: fieldTableSize } = fieldSizeMap[fieldSize as string] || {}

  return {
    searchSize: searchSize || fieldSearchSize,
    tableSize: tableSize || fieldTableSize,
  }
}

export { getSize }
