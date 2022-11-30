import React, { FC } from 'react';
import { calculateMu } from '../../queries/mu';
import createPopup from '../createPopup';
import createToast from '../createToast';

import '../../css/ridedetails.css';

const CalculateMu: FC = () => {
  const popup = createPopup();

  const showPopup = () => {
    popup({
      title: 'Calculate Mu',
      text: 'Calculating Mu will take up a lot of server resources and will make the current mu measurements unavailable for everyone. Are you sure you want to calculate mu?',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonText: 'Calculate',
    }).then((result: any) => {
      if (!result.isConfirmed) return;
      calculateMu().then((response) => {
        createToast({ title: response.data });
      });
    });
  };

  return (
    <div
      onClick={showPopup}
      className="ride-metadata-checkbox md-checkbox-add btn"
      style={{ marginBottom: '1rem' }}
    >
      Calculate Mu
    </div>
  );
};

export default CalculateMu;
