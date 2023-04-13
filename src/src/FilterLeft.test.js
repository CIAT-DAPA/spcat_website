import React from 'react';
import { render } from '@testing-library/react';

import FilterLeft from './components/filterLeft/FilterLeft';

describe('MyComponent', () => {
  test('debe contener al menos una opción', () => {
    const { getByTestId } = render(<FilterLeft />);

    expect(getByTestId('my-component')).toContainElement(
      document.querySelector('option')
    );
  });
});
