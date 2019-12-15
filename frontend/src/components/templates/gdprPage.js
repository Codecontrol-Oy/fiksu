import React from 'react'
import GridContainer from "../grid/container"
import Heading from "../atoms/heading"
import Grid from '../grid/grid'
import Paragraph from '../atoms/paragraph'
import Divider from '../atoms/divider'


const GdprPage = props => {

    return (
        <GridContainer style={{ margin: "5rem 0 5rem 0" }} direction={"column"} size={12} justify={"center"}>
            
            <Grid sizeS={12} sizeM={10} sizeL={7}>
                <Heading variant={2}>
 Rekisteri- ja tietosuojaseloste
                                      Henkilötietolain (10 ja 24 §) ja EU:n yleisen tietosuoja-asetuksen (GDPR) mukainen rekisteri- ja tietosuojaseloste.
                                      
                </Heading>
                <Divider />

            <Heading align={"left"} variant={3}>
                1. Rekisterinpitäjä
            </Heading> 
                <Paragraph align={"left"}>
            Codecontrol Oy, Itsenäisyydenkatu 42, 28130 Pori
                            
                </Paragraph>
        
                <Heading align={"left"} variant={3}>
        2. Rekisteristä vastaava yhteyshenkilö
                                
            </Heading>
                <Paragraph align={"left"}>
                codecontrol(at)codecontrol.fi
                </Paragraph>

                <Heading align={"left"} variant={3}>
        3. Rekisterin nimi
                                
                                
            </Heading>
                <Paragraph align={"left"}>
                    Fiksu käyttäjärekisteri
                </Paragraph>

                        <Heading align={"left"} variant={3}>
        4. Oikeusperuste ja henkilötietojen käsittelyn tarkoitus
            </Heading>
                <Paragraph align={"left"}>
        EU:n yleisen tietosuoja-asetuksen mukainen oikeusperuste henkilötietojen käsittelylle on
                    
                    - sopimus, jossa rekisteröity on osapuolena
                    
                    Asiakasrekisterin tietoja käytetään asiakkaan tilausten käsittelyyn, laskutukseen ja asiakkuuden hoitoon sekä asiakassuhteeseen liittyvään tiedottamiseen.
                    
            
                </Paragraph>


                <Heading align={"left"} variant={3}>
        5. Rekisterin tietosisältö
                </Heading>
                <Paragraph align={"left"}>
                            Rekisteriin tallennettavia tietoja ovat: yrityksen nimi, yhteystiedot (sähköpostiosoite), laskutustiedot (ostonumero) ja tilattuihin palveluihin liittyvät tiedot.
 
Tietoja säilytetään niin kauan, kuin se on tarpeellista käyttötarkoituksen vuoksi tai niin kauan kuin on asiakkaan kanssa erikseen sovittu. Tiedot anonymisoidaan asiakassuhteen päättymisen jälkeen.
 
                </Paragraph>


                <Heading variant={3} align={"left"}>
        6. Säännönmukaiset tietolähteet
                </Heading>

                <Paragraph align={"left"}>
        Rekisteriin tallennettavat tiedot saadaan asiakkaalta mm. www-lomakkeilla lähetetyistä viesteistä, sähköpostitse, puhelimitse, sosiaalisen median palvelujen kautta, sopimuksista, asiakastapaamisista ja muista tilanteista, joissa asiakas luovuttaa tietojaan.
                    
            
                </Paragraph>

                <Heading variant={3} align={"left"}>
        7. Tietojen säännönmukaiset luovutukset ja tietojen siirto EU:n tai ETA:n ulkopuolelle
                </Heading>

                <Paragraph align={"left"}>
        Tietoja ei luovuteta säännönmukaisesti muille tahoille. Tietoja voidaan julkaista siltä osin kuin niin on sovittu asiakkaan kanssa.

                </Paragraph>
        
                <Heading variant={3} align={"left"}>
        8. Rekisterin suojauksen periaatteet
                </Heading>

                <Paragraph align={"left"}
                >
        Rekisterin käsittelyssä noudatetaan huolellisuutta ja tietojärjestelmien avulla käsiteltävät tiedot suojataan asianmukaisesti. Kun rekisteritietoja säilytetään Internet-palvelimilla, niiden laitteiston fyysisestä ja digitaalisesta tietoturvasta huolehditaan asiaankuuluvasti. Rekisterinpitäjä huolehtii siitä, että tallennettuja tietoja sekä palvelimien käyttöoikeuksia ja muita henkilötietojen turvallisuuden kannalta kriittisiä tietoja käsitellään luottamuksellisesti ja vain niiden työntekijöiden toimesta, joiden työnkuvaan se kuuluu.
            
                </Paragraph>
        
                <Heading variant={3} align={"left"}>
        9. Tarkastusoikeus ja oikeus vaatia tiedon korjaamista
                </Heading>
                <Paragraph align={"left"}>
        Jokaisella rekisterissä olevalla henkilöllä on oikeus tarkistaa rekisteriin tallennetut tietonsa ja vaatia mahdollisen virheellisen tiedon korjaamista tai puutteellisen tiedon täydentämistä. Mikäli henkilö haluaa tarkistaa hänestä tallennetut tiedot tai vaatia niihin oikaisua, pyyntö tulee lähettää kirjallisesti rekisterinpitäjälle. Rekisterinpitäjä voi pyytää tarvittaessa pyynnön esittäjää todistamaan henkilöllisyytensä. Rekisterinpitäjä vastaa asiakkaalle EU:n tietosuoja-asetuksessa säädetyssä ajassa (pääsääntöisesti kuukauden kuluessa).

                </Paragraph>

                <Heading variant={3} align={"left"}>
        10. Muut henkilötietojen käsittelyyn liittyvät oikeudet
                </Heading>
                <Paragraph align={"left"}>
        Rekisterissä olevalla henkilöllä on oikeus pyytää häntä koskevien henkilötietojen poistamiseen rekisteristä ("oikeus tulla unohdetuksi"). Niin ikään rekisteröidyillä on muut EU:n yleisen tietosuoja-asetuksen mukaiset oikeudet kuten henkilötietojen käsittelyn rajoittaminen tietyissä tilanteissa. Pyynnöt tulee lähettää kirjallisesti rekisterinpitäjälle. Rekisterinpitäjä voi pyytää tarvittaessa pyynnön esittäjää todistamaan henkilöllisyytensä. Rekisterinpitäjä vastaa asiakkaalle EU:n tietosuoja-asetuksessa säädetyssä ajassa (pääsääntöisesti kuukauden kuluessa).

                </Paragraph>
        
                <Heading variant={3} align={"left"}>
        Evästeiden käyttö
            
                </Heading>
                <Paragraph align={"left"}>
        Palvelussa käytetään evästeitä ja niiden käyttö on välttämätöntä Palvelun toimivuudelle. Evästeitä käytetään Palvelun käyttäjäystävällisyyden parantamiseksi. Käyttäjä antaa nimenomaisen suostumuksensa evästeiden käyttämiseen.
            
                </Paragraph>
                <Heading variant={3} align={"left"}>
        Palvelun toimittajat
            
                </Heading>
                <Paragraph align={"left"}>
        Palvelun toimittaja: Codecontrol Oy

                </Paragraph>

        
        
        
        Järjestelmä sijaitsee OVH:n omistamilla palvelimilla, joita operoi Codecontrol Oy.
        
            </Grid>

           
        </GridContainer>
    )
}
export default GdprPage