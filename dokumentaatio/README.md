# FullStack - Booking-app - harjoitustyö - Dokumentaatio
* [Tuntikirjanpito](https://github.com/wametsol/FSHT/blob/master/dokumentaatio/tuntikirjanpito.MD)

* [Jatkokehitys](https://github.com/wametsol/FSHT/blob/master/dokumentaatio/ohjeet.MD)

* [ToDo](https://github.com/wametsol/FSHT/blob/master/dokumentaatio/extraInfo.MD)

## Käyttöohjeet
Ohjeet perustuvat (16.06.2020) julkaistuun versioon.

* Rekisteröinti
  - Rekisteröinti voidaan suorittaa osoitteessa https://ajanvaraus.web.app/ , tai missä tahansa julkisessa ajanvarausnäkymässä.
  - Rekisteröintiä varten tarvitaan sähköpostiosoite. Tähän sähköpostiin lähetetään käyttäjän varauksia koskevat ilmoitukset.
* Järjestelmän luominen
  - Rekisteröidyttyään/kirjauduttuaan, kotinäkymässä listataan kaikki järjestelmät jossa käyttäjä on ylläpitäjänä.
  - Kirjautunut käyttäjä voi luoda itselleen ajanvaraussivuston, joka tulee näkyviin valittuun osoitteeseen. (Esim. https://ajanvaraus.web.app/esimerkki)
  - Järjestelmää voidaan tämän jälkeen hallita osoitteessa https://ajanvaraus.web.app/omasivusto/admin 
* Järjestelmän hallinta
  - Järjestelmän hallintapaneeli koostuu 7 välilehdestä (Varaukset, Palvelut, Resurssit, Ajanhallinta, Näkymät, Käyttäjänhallinta, Yhteystiedot)
  - **Varaukset** välilehdellä listataan kaikki järjestelmän varaukset. Varauksia selataan päivämäärän mukaan, ja niitä voidaan myös filtteröidä resurssien mukaan. Varauksia voidaan myös perua tältä välilehdeltä vaikka käyttäjän peruutusaika on jo umpeutunut.
  - **Palvelut** välilehdellä listataan kaikki järjestelmän palvelut 'Laite' ja 'Henkilö' välilehtiin. Palveluita voidaan luoda luontilomakkeella, ja luodessa valitaan palvelun tyypiksi 'Henkilö' tai 'Laite'. Valittu tyyppi vaikuttaa myöhemmin käytettäviin resursseihin ja varauksiin. Palveluita voidaan myös muokata ja poistaa.
  - **Resurssit** välilehdellä listataan kaikki käytössä olevat resurssit. Resursseja voidaan lisätä, ja kuten edellä, asettaa niiden tyypiksi 'Henkilö' tai 'Laite'. 
    * 'Henkilö' lomakkeeseen tulee henkilölle asettaa sukupuoli, nimi, lisätiedot ja halutut 'Henkilö' - tyypin palvelut. 
    * 'Laite' lomakkeessa taas kysytään nimen, lisätietojen sekä 'Laite' - tyypin palveluiden lisäksi identtisten resurssien määrää. Identtisten resurssien määrä vaikuttaa tarjolla olevien varausresurssien määrään. Esimerkiksi Keilahalli voisi asettaa itselleen resurssin Rata, ja määräksi 5, jolloin samanaikaisesti resurssille Rata voidaan tehdä 5 erillistä varausta.
  - **Ajanhallinta** välilehdellä voidaan asettaa aukioloajat, eli ajat jonka puitteessa vapaita aikoja tarjotaan. 
    * Järjestelmälle voidaan asettaa yleiset viikkoajat, sekä lisätä erillisiä 'poikkeuspäiviä', joiden avulla voidaan määritellä yksittäisten päivien aikatauluja.
    * Kun resursseja on luotu, voidaan täällä myös asettaa henkilökohtaisia aikatauluja, eli määritellä henkilö resurssille työajat. Jos poikkeusaikoja asetetaan henkilö-resurssille siten, että varauksia peruuntuisi, avataan valintaikkuna jossa on mahdollista määrittää perutaanko, jätetäänkö vai siirretäänkö varaukset. Jos varaus perutaan tai siirretään, lähetetään järjestelmälle sekä asiakkaalle vahvistussähköposti.
  - **Näkymät** välilehdellä voidaan määrittää Ylä- ja Ala-palkin värejä, muotoilua sekä asettaa sivustolle taustakuva. Alapalkki voidaan myös otta pois käytöstä.
  - **Käyttäjähallinta** välilehdellä voidaan lisätä ja poistaa ylläpitäjiä.
  - **Yhteystiedot** välilehdellä voidaan muokata järjestelmän sisäisiä sekä julkisesti näkyviä tietoja.
  
* Varausten teko
  - Julkisen sivun sekä vapaiden aikojen tarkastelu onnistuu ilman kirjautumista, mutta kirjautuminen vaaditaan ennen varaamista
  - Kirjautunut henkilö voi vapaasti varata vapaita aikoja, sekä tarkastella ja perua omia aikojaan sivuston 'Varaukset' välilehdeltä
  - Kirjautunut henkilö voi myös muokata profiiliaan 'Profiili' välilehdellä.


-----------------------------------------
