import './Footer.css'
import LogoC from '../../assets/img/Ciat-logo.png'
import LogoCT from '../../assets/img/crop-trust-logo.png'
import LogoI from '../../assets/img/Icarda-logo.png'
const Footer=()=>{
    return(
        <div className="container">
            <h1 className="text-center">Powered by</h1>
            <div className="container d-flex">
                <div className='ci'>
                    <a href="https://ciat.cgiar.org/?lang=es" target="_blank">
                    <img src={LogoC} alt="" />
                    </a>
                    <p className='text-center'> <strong>CIAT</strong></p>
                    <p className='text-center'>Palmira,Colombia</p>
                    
                </div>
                <div className='ic'>
                <a href="https://www.icarda.org" target="_blank">
                <img src='https://www.icarda.org/themes/custom/icarda/logo.svg' alt="" />
                </a>
                    <p className='text-center'> <strong>ICARDA</strong></p>
                    <p className='text-center'>Rabat,Morocco</p>
                </div>
                <div className='ct'>
                    <a href="https://www.croptrust.org" target='_blank'>
                    <img  src={LogoCT} alt="" />
                    </a>
                    <p className='text-center '> <strong>Crop Thrust</strong></p>
                    <p className='text-center'>Bonn,Germany</p>
                </div>

            </div>
        </div>
    )
}
export default Footer;