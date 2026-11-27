import type { StatusTrackProps, StatusTrackStep } from '../StatusTrack/index';
import './JobTrack.css';
export type JobTrackProps = Omit<StatusTrackProps, 'items'> & {
    /** The delivery stages from the app. */
    items: readonly StatusTrackStep[];
};
export declare function JobTrack({ className, ...rest }: JobTrackProps): import("react").JSX.Element;
