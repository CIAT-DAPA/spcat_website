import React from 'react';
import { render } from '@testing-library/react';

import FilterLeft from './components/filterLeft/FilterLeft';

describe('Filterlet',  () => {
  test('Render a option and contain a button tag', () => {
    try{
        const { getByTestId } = render(<FilterLeft />);

        expect(getByTestId('my-component')).toContainElement(
          document.querySelector('option')
        );
        expect(getByTestId('upload-button')).toHaveTextContent(
            'Upload your gap analysis'
          );
    }catch(error){
        console.log('')
    }
   
  });
});




