import React, {useEffect} from 'react';
import { useHistory } from 'react-router-dom';

// I found this really useful code for tracking views on SPAs here - https://medium.com/javascript-in-plain-english/google-analytics-with-react-router-and-hooks-16d403ddc528
const useTracking = (trackingId) => {
    const { listen } = useHistory()

    useEffect(() => {
        const unlisten = listen((location) => {
            if (!window.gtag) {
                console.log('Tracking not present in index.html');
                return;
            }
            if (!trackingId) {
                console.log('Tracking not enabled, as `trackingId` was not given and there is no `GA_MEASUREMENT_ID`.')
                return;
            }

            window.gtag('config', trackingId, { page_path: location.pathname });
        });

        return unlisten;
    }, [trackingId, listen]);
}

export default useTracking;