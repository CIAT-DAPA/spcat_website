import './about.css'
import Footer from '../footer/Footer';
import {React,useContext} from 'react';
const About=()=>{
    return(
        
        <>
         <div className="container">
            <h1 className="text-center title">Background</h1>
            <p>
            Traditional farmer varieties (“landraces”) are a foundation of subsistence agriculture and are among the most important genetic resources for contemporary plant breeding (Camacho Villa et al., 2005). Major international ex situ collections have been established following collecting missions especially during the 1970s-90s to collect landrace diversity led by the IBPGR/IPGRI, particularly from the primary regions of diversity of crops worldwide, also called Vavilov centers (Khoury et al. 2016). In the period 1974–2012, such efforts resulted in over 225,000 plant samples of ca. 4,300 species collected during more than 500 collecting missions (Thormann et al., 2015). As a result, the 11 international genebanks managed by CGIAR centers are among the largest, most diverse, and most widely used of the world’s ex situ collections, with ~700K accessions currently conserved (CGIAR Genebank Platform, 2019), complementing the important national collections conserved around the world.
            </p>
            <p>
            While international collaborations on collecting of crop landraces reduced significantly since enactment of the Convention on Biological Diversity (CBD) post 1992, renewed efforts at collaboration are inspired by progress made in international fora, including by the International Treaty on Plant Genetic Resources for Food and Agriculture. The need to collect and conserve this diversity is outlined in the CBD’s 2010-2020 Aichi Biodiversity Targets (Target 13), Global Strategy for Plant Conservation, and upcoming post-2020 Global Biodiversity Framework, and well as in the Sustainable Development Goals (Goal 2.5).
            </p>
            <p>
            The extent to which the world’s genebank collections adequately cover crops’ extant landrace genetic diversity is not known. Geographically-explicit information on unique landrace diversity is needed to guide further collecting efforts aimed at filling gaps in ex situ collections. Toward this aim, the CGIAR Landrace Gap Analysis Team has developed a geospatial modelling framework to inform further collecting efforts for crop landraces (Ramirez-Villegas et al., 2020). The method uses accession-level passport, characterization and genetic information of currently conserved crop landraces, combined with geospatial environmental and anthropogenic data. It uses state-of-the-art modelling methods to predict geographic areas that are likely gaps in ex situ landrace conservation collections, with regard to landrace genetic diversity.
            </p>
            <h2>References</h2>
             <p> 1. Camacho Villa, T. C., Maxted, N., Scholten, M. & Ford-Lloyd, B. 2005. Defining and identifying crop landraces. Plant Genet. Resour. Charact. Util. 3, 373–384.</p>
             <p>2. CGIAR Genebank Platform. 2019. 2019 Annual Report: CGIAR Genebank Platform. <a  target='_blank' href="https://storage.googleapis.com/cgiarorg/2020/07/2019-Genebank-Platform-Annual-Report.pdf">Go to link</a> . Khoury, C. K. et al. 2016. Origins of food crops connect countries worldwide. Proc. R. Soc. B Biol. Sci. 283, 20160792.</p>
             <p>3. Ramirez‐Villegas, J., Khoury, C.K., Achicanoy, H.A., Mendez, A.C., Diaz, M.V., Sosa, C.C., Debouck, D.G., Kehel, Z., Guarino, L., 2020. A gap analysis modelling framework to prioritize collecting for ex situ conservation of crop landraces. Divers. Distrib. 26, 730–742. doi:10.1111/ddi.13046</p>
             <p>4. Thormann, I., Fiorino, E., Halewood, M. & Engels, J. M. M. 2015. Plant genetic resources collections and associated information as a baseline resource for genetic diversity studies: an assessment of the IBPGR-supported collections. Genet. Resour. Crop Evol. 62, 1279–1293.</p>

             <h2>Acknowledgements </h2>
             <p>We acknowledge the support and collaboration of the Global Crop Diversity Trust (GCDT) and the Building Opportunities for Lesser-known Diversity in Edible Resources (BOLDER) initiative.  </p>
        </div>
        <Footer/>
        </>
       
    )
}
export default About;