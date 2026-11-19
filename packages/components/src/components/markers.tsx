import type { CollapsePanelProps } from 'antd/es/collapse'
import type { StepsProps } from 'antd/es/steps'
import type { ColumnProps } from 'antd/es/table'
import type { TabPaneProps } from 'antd/es/tabs'
import type { FC, PropsWithChildren } from 'react'

export type ICollapsePanelProps = CollapsePanelProps

export type IColumnProps = ColumnProps<any>

export interface ITabPaneProps extends TabPaneProps {
  /** 面板标识 */
  key: string | number
}

export type IStepPaneProps = NonNullable<StepsProps['items']>[number]

/**
 * 折叠面板结构标记。
 * 实际面板由 FormCollapse / ArrayCollapse 读取 schema 后渲染，这里只透传 children。
 */
export const CollapsePanel: FC<PropsWithChildren<ICollapsePanelProps>> = ({ children }) => <>{children}</>
CollapsePanel.displayName = 'CollapsePanel'

/**
 * 表格列结构标记。
 * 实际列由 ArrayTable / SelectTable 读取 schema 后渲染，这里不产出任何内容。
 */
export const Column: FC<IColumnProps> = () => <></>
Column.displayName = 'Column'

/**
 * 标签页面板结构标记。
 * 实际面板由 FormTab 读取 schema 后渲染，这里只透传 children。
 */
export const TabPane: FC<PropsWithChildren<ITabPaneProps>> = ({ children }) => <>{children}</>
TabPane.displayName = 'TabPane'

/**
 * 步骤面板结构标记。
 * 实际步骤由 FormStep 读取 schema 后渲染，这里只透传 children。
 */
export const StepPane: FC<PropsWithChildren<IStepPaneProps>> = ({ children }) => <>{children}</>
StepPane.displayName = 'StepPane'
