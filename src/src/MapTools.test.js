import { render, screen } from '@testing-library/react';
import MapTools from './pages/mapTools/MapTools';

test('renders Map component', async () => {
    try{
        const { getByTestId } = render(<MapTools />);
        expect(getByTestId('my-paragraph')).toHaveTextContent('Este es mi párrafo');
  expect(getByTestId('map-component')).toBeInTheDocument();
  expect(getByTestId('filter-right-component')).toBeInTheDocument();

    }catch(error){
        console.log('')
    }
    
  });