import type { TabBarProps, TabBarTabProps } from './TabBar.types';
import './TabBar.css';
declare function TabBarTab({ label, selected, leading, onPress, className, ref, ...rest }: TabBarTabProps): import("react").JSX.Element;
export declare function TabBar({ children, value, onChange, className, id, style, ref, ...rest }: TabBarProps): import("react").JSX.Element;
export { TabBarTab };
