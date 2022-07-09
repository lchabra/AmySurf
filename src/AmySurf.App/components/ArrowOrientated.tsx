import React, { CSSProperties } from 'react';

export function IconOrientated(props: { data: IconOrientatedData }): React.JSX.Element {
    const styles = getStyles(props.data.orientation)

    return (
        <div style={styles.wrapper}>
            <div>
                {props.data.icon}
            </div>
            <div className='text-light text-nowrap position-absolute top-50 start-50 translate-middle'>
                <div className='fs-6' style={styles.textWrapper}>
                    {props.data.label}
                </div>
            </div>
        </div>
    );
}

function getStyles(orientation: number): Record<string, CSSProperties> {
    let textRotationCorrection: number = 0
    if (orientation > 90 && orientation < 270) {
        textRotationCorrection = 180
    }
    return {
        wrapper: {
            transform: `rotate(${orientation}deg)`,
            msTransform: `rotate(${orientation}deg)`,
            WebkitTransform: `rotate(${orientation}deg)`,
        },
        textWrapper: {
            transform: `rotate(${textRotationCorrection}deg)`,
            msTransform: `rotate(${textRotationCorrection}deg)`,
            WebkitTransform: `rotate(${textRotationCorrection}deg)`,
        },
    }
}

export type IconOrientatedData = {
    label: string,
    orientation: number,
    icon: React.JSX.Element
}
