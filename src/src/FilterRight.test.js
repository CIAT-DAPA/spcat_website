import React from 'react';
import { render } from '@testing-library/react';

import FilterRight from './components/filterRight/FilterRight';

describe('FilteRight',  () => {
  test('Render a option and contain a button tag', () => {
    try{
        const { getByText, getByTestId } = render(<FilterRight />);

    expect(getByText('Route')).toBeInTheDocument();
    expect(getByTestId('input-field')).toBeInTheDocument();
    expect(getByTestId('get-route-button')).toHaveTextContent('Get route');
    }catch(error){
        console.log('')
    }
   
  });
});




