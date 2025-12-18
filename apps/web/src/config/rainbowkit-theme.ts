import { darkTheme, type Theme } from '@rainbow-me/rainbowkit';

/**
 * Custom RainbowKit Theme Configuration
 * 
 * 基于项目主色系 green-500 (oklch(0.55 0.20 145)) 的深色主题设计
 * 
 * 设计理念：
 * - 主色调：使用 green-500 (#16a34a) 作为主要强调色，体现生命力和科技感
 * - 视觉风格：采用毛玻璃效果和大圆角，打造现代化、优雅的视觉体验
 * - 对比度：确保所有文字和交互元素符合 WCAG 可访问性标准
 * - 一致性：与项目整体的深色主题和设计语言保持一致
 * 
 * 色彩系统：
 * - Primary: green-500 (#16a34a) - 主要操作按钮、选中状态
 * - Secondary: green-400 (#22c55e) - 渐变效果、活动指示器
 * - Background: rgba(10, 10, 10, 0.95) - 深色半透明背景
 * - Border: rgba(255, 255, 255, 0.08) - 低对比度边框
 * 
 * @see https://www.rainbowkit.com/docs/theming
 */
export const customTheme: Theme = {
  ...darkTheme({
    accentColor: '#16a34a', // green-500: 主强调色
    accentColorForeground: '#ffffff', // 白色文字，确保 4.5:1 对比度
    borderRadius: 'large', // 使用 12px 圆角，与项目 radius-12 一致
    fontStack: 'system', // 使用 Inter 系统字体
    overlayBlur: 'large', // 强毛玻璃效果，提升视觉层次
  }),
  colors: {
    // 继承 darkTheme 的默认颜色
    ...darkTheme({
      accentColor: '#16a34a',
      accentColorForeground: '#ffffff',
    }).colors,
    
    // 自定义颜色覆盖
    // 操作按钮
    actionButtonBorder: 'rgba(255, 255, 255, 0.08)',
    actionButtonBorderMobile: 'rgba(255, 255, 255, 0.08)',
    actionButtonSecondaryBackground: 'rgba(255, 255, 255, 0.03)',
    
    // 关闭按钮
    closeButton: 'rgba(255, 255, 255, 0.6)',
    closeButtonBackground: 'rgba(255, 255, 255, 0.08)',
    
    // 连接按钮
    connectButtonBackground: '#16a34a',
    connectButtonBackgroundError: '#ef4444',
    connectButtonInnerBackground: 'linear-gradient(90deg, #22c55e 0%, #16a34a 50%, #22c55e 100%)',
    connectButtonText: '#ffffff',
    connectButtonTextError: '#ffffff',
    
    // 连接指示器
    connectionIndicator: '#22c55e',
    
    // 通用边框
    generalBorder: 'rgba(255, 255, 255, 0.08)',
    generalBorderDim: 'rgba(255, 255, 255, 0.04)',
    
    // 菜单项
    menuItemBackground: 'rgba(255, 255, 255, 0.03)',
    
    // 模态框
    modalBackdrop: 'rgba(0, 0, 0, 0.8)',
    modalBackground: 'rgba(10, 10, 10, 0.95)',
    modalBorder: 'rgba(255, 255, 255, 0.08)',
    modalText: '#ffffff',
    modalTextDim: 'rgba(255, 255, 255, 0.4)',
    modalTextSecondary: 'rgba(255, 255, 255, 0.6)',
    
    // 个人资料
    profileAction: 'rgba(255, 255, 255, 0.03)',
    profileActionHover: 'rgba(255, 255, 255, 0.06)',
    profileForeground: 'rgba(10, 10, 10, 0.95)',
    
    // 选中状态
    selectedOptionBorder: '#16a34a',
    
    // 待机状态
    standby: 'rgba(255, 255, 255, 0.3)',
  },
};

/**
 * 主题预设：可以根据不同场景使用不同的主题变体
 */
export const themePresets = {
  /**
   * 标准主题：默认的深色主题
   */
  default: customTheme,

  /**
   * 紧凑主题：适用于移动端或空间受限的场景
   */
  compact: {
    ...darkTheme({
      accentColor: '#16a34a',
      accentColorForeground: '#ffffff',
      borderRadius: 'medium',
      fontStack: 'system',
      overlayBlur: 'small',
    }),
    colors: {
      ...darkTheme({
        accentColor: '#16a34a',
        accentColorForeground: '#ffffff',
      }).colors,
      // 使用与 customTheme 相同的颜色覆盖
      connectButtonBackground: '#16a34a',
      connectButtonInnerBackground: 'linear-gradient(90deg, #22c55e 0%, #16a34a 50%, #22c55e 100%)',
      connectionIndicator: '#22c55e',
      modalBackground: 'rgba(10, 10, 10, 0.95)',
      selectedOptionBorder: '#16a34a',
    },
  } as Theme,

  /**
   * 高对比度主题：增强可访问性
   */
  highContrast: {
    ...darkTheme({
      accentColor: '#16a34a',
      accentColorForeground: '#ffffff',
      borderRadius: 'large',
      fontStack: 'system',
      overlayBlur: 'large',
    }),
    colors: {
      ...darkTheme({
        accentColor: '#16a34a',
        accentColorForeground: '#ffffff',
      }).colors,
      // 增强对比度
      modalText: '#ffffff',
      modalTextSecondary: 'rgba(255, 255, 255, 0.8)',
      generalBorder: 'rgba(255, 255, 255, 0.16)',
      connectButtonBackground: '#16a34a',
      connectButtonInnerBackground: 'linear-gradient(90deg, #22c55e 0%, #16a34a 50%, #22c55e 100%)',
      connectionIndicator: '#22c55e',
      selectedOptionBorder: '#16a34a',
    },
  } as Theme,
} as const;

/**
 * 导出类型以供 TypeScript 使用
 */
export type ThemePreset = keyof typeof themePresets;

/**
 * 获取指定预设的主题配置
 * @param preset - 主题预设名称（'default' | 'compact' | 'highContrast'）
 * @returns RainbowKit 主题配置
 * 
 * @example
 * ```typescript
 * import { getTheme } from '@/config/rainbowkit-theme';
 * 
 * // 使用默认主题
 * const theme = getTheme('default');
 * 
 * // 使用紧凑主题
 * const compactTheme = getTheme('compact');
 * ```
 */
export function getTheme(preset: ThemePreset = 'default'): Theme {
  return themePresets[preset];
}
