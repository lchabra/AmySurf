import React from 'react';
import ExpandableStack from "./ExpandableStack";
import { SpotSelectForm } from "./SpotSelectForm";
import { useUser } from '../contexts/useUser';
import { Container } from '../core-ui/ui';

export function SpotSelectContainer(): React.JSX.Element {
    const user = useUser();
    const isSpotSelected = user.userSettings.spotName !== '';

    return (
        <Container fluid className='p-0'>
            {!isSpotSelected && <h5 className="pt-2 d-flex justify-content-center">No spot selected</h5>}
            <ExpandableStack disableExpand={true} uniqueLocalStorageKey='Spots' title="Spots" >
                <SpotSelectForm />
            </ExpandableStack>
        </Container>
    );
}