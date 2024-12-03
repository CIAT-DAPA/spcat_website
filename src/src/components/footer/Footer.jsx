import './Footer.css'
import LogoC from '../../assets/img/Ciat-logo.png'
import LogoCT from '../../assets/img/crop-trust-new_logo.png'
import LogoI from '../../assets/img/Icarda-logo.png'
const Footer=()=>{
    return(
        <div className="container ">
            <div>
            <h1 className="text-center mt-5">Powered by</h1>
            </div>
            <div className="container d-flex row">
                <div className='ci col-md-4'>
                    <a href="https://ciat.cgiar.org/?lang=es" target="_blank">
                    <img className='img-logo' src={LogoC} alt="" />
                    </a>
                    <p className='text-center'> <strong>CIAT</strong></p>
                    <p className='text-center'>Palmira,Colombia</p>
                    
                </div>
                <div className='ic col-md-4'>
                <a href="https://www.icarda.org" target="_blank">
                <img  className='img-logo'src={LogoI} alt="" />
                </a>
                    <p className='text-center'> <strong>ICARDA</strong></p>
                    <p className='text-center'>Rabat,Morocco</p>
                </div>
                <div className='ct col-md-4'>
                    <a href="https://www.croptrust.org" target='_blank'>
                    <img className='img-logo' src={LogoCT} alt="" />
                    </a>
                    <p className='text-center '> <strong>Crop Trust</strong></p>
                    <p className='text-center'>Bonn,Germany</p>
                </div>

            </div>
        </div>
    )
}
export default Footer;