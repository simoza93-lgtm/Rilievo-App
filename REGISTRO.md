# Registro delle modifiche — app Rilievo

Le modifiche più recenti stanno in cima. Il registro completo fino al 9 novembre 2026 (valori, regole del
rilievo, simbologia, scale, script) è nel documento: https://claude.ai/artifact/KUbyUVj8aMznhWUcgayYdo

## 27 novembre 2026 — Quote esterne non allineate vicino a balconi e ringhiere
- Con una ringhiera (o un altro muro) attaccata **da fuori** a un lato sotto un rientro, la quota esterna contava anche lo spessore dell'angolo rientrante (per esempio 5,00 invece di 4,70): si sovrapponeva alla quota vicina e finiva su una seconda riga. Ora si ferma allo spigolo, come senza balcone, e le due stanno in fila. Vale a schermo, nel pannello e nella Scheda PDF; lo script AutoCAD e le misure prese non cambiano.

## 27 novembre 2026 — Totale esterno sui lati con ringhiera attaccata
- Su una facciata la cui faccia esterna è spezzata da una ringhiera (o da un muro attaccato da fuori) ora il **totale esterno si scrive**: toccando la sua quota o dal pannello (prima il tocco non faceva niente). Si comporta come sulle altre facciate: con i lati interni già misurati è una verifica (rosso e avviso in «Controlli» se non torna di oltre 3 cm); senza, decide la lunghezza, e pianta e script la seguono.
- Un totale esterno scritto da ora resta **esterno** anche se dopo si attacca una ringhiera (prima finiva tra le misure interne). Si salva nel nuovo campo facoltativo `pl.fx`: i rilievi vecchi si aprono come prima. I totali scritti con le versioni precedenti non hanno il campo.

## 26 novembre 2026 — Quote esterne: via dai muri interni, a 1 m dalla pianta
- Un muro con **ambienti da tutte e due le parti** (anche se «Perimetrale», per esempio un interno da 0,30 delle case vecchie) non ha più la quota esterna: né linea, né pallino, né casella, e nel pannello spariscono i «totali» di facciata (restano se c'era già un totale scritto lì). Balconi, terrazzi e marciapiedi contano come esterno. Spessori e misure interne non cambiano.
- Le quote esterne stanno **a 1,00 m dall'elemento più esterno** della pianta in quella direzione (muri, ringhiere, scale, porte che aprono fuori, quote libere), allineate sulla stessa riga; vanno su una seconda riga solo se si sovrappongono. Vale a schermo e nella Scheda PDF; lo script AutoCAD era già così.
- Per farle stare nello schermo, «Adatta» può inquadrare un po' più largo.

## 26 novembre 2026 — Totale del lato anche con porte, finestre e scale
- Sui lati con vani (o con una scala accostata) in pianta, oltre alle parziali, c'è ora il **totale del lato**: una linea più dentro la stanza, tratteggiata arancione con il pallino se è da prendere, grigia (solo toccando la stanza) se si ricava dalle altre misure, nera col lucchetto se l'hai scritta. Si tocca e si scrive: non serve più «Quota».
- **Prossima** in ogni stanza chiede prima i totali dei lati, poi parziali e larghezze (il numero tra parentesi cresce).
- Lo **script AutoCAD non cambia**: il totale scritto qui guida il disegno ma non diventa una quota (per quella resta «Quota»).
- Vale per la grafica delle misure predefinita; quella «classica» resta come prima.

## 26 novembre 2026 — Nuova grafica della pianta (a scelta)
- In **Impostazioni → Pianta** c'è la casella «Nuova grafica»: muri pieni neri, porte e finestre in grigio scuro, stanze con fondo grigio, **balconi, terrazzi e marciapiedi bianchi** (dalla destinazione dell'ambiente), fondo a puntini ogni 0,50 m al posto delle righe. La pianta resta chiara anche con il tablet in tema scuro.
- È **spenta di norma** e vale per il dispositivo. Le misure restano tutte come prima (lucchetti, pallini, rosso se non tornano).
- La **Scheda PDF** e lo **script AutoCAD** non cambiano.

## 24 novembre 2026 — Importa DXF: layer, più piante, avvisi, velocità
Provato anche con un DXF vero dello studio (sottotetto, due scale): muri, 17 aperture e le due scale (11 e 9 gradini, passo 0,28 m) tornano come prima.
- **Anteprima vuota con i DXF veri**: il disegno veniva sempre incluso dall'origine, quindi con coordinate di migliaia di metri i muri restavano un puntino. Ora l'anteprima si adatta ai muri.
- **Nomi dei layer**: oltre ai nomi dello studio, PORTE, FINESTRE, SERRAMENTI, DOOR, WINDOW, A-DOOR vanno su «Infissi e ringhiere» (prima su «Ignora» e le porte diventavano varchi); SCALA/SCALE/STAIR sui tramezzi; QUOTE, TESTI, ARREDI, CARTIGLIO, HATCH, TRATTEGGIO, VERDE, ASSI e simili su «Ignora». Un layer spento o congelato si propone «Ignora».
- **Scelte ricordate**: ora si ricordano solo i layer cambiati a mano (chiave nuova `rilievo-dxf-layer2`: le scelte vecchie, che conservavano anche le proposte sbagliate di prima, non si usano più).
- **Più piante nello stesso file**: i muri e le scale a meno di 2,5 m l'uno dall'altro formano un gruppo; se i gruppi sono più d'uno compaiono numerati in rosso nel disegno e nell'elenco, con il nome letto dal testo scritto vicino (PIANO TERRA, PIANO PRIMO, SOTTOTETTO…) e il tasto «Solo questo». Importando un gruppo come nuovo piano l'origine è l'angolo del gruppo: piante affiancate nel disegno restano sovrapposte come piani. Il nome del testo è la proposta per il nome del piano.
- **Avvisi invece del silenzio**: nessun muro trovato (muri a linea sola o riempimenti) con il motivo; tratti curvi delle polilinee su layer di muri (letti come dritti); gradini che non formano una scala dritta (obliqua, curva, chiocciola). Il tasto di creazione resta spento se non ci sono muri.
- **Velocità**: l'unione delle linee non riparte più da capo a ogni unione. 1600 linee oblique su un layer di muri: da 4,4 s a 0,1 s; 6000 linee: da oltre 200 s a 1,5 s. Sopra 8000 linee sui layer scelti come muri l'app chiede conferma, con il consiglio di mettere «Ignora» sui layer che non sono muri.
- **Codifica**: i DXF vecchi (Windows-1252) si leggono con gli accenti giusti; un commento `999` in testa al file non fa più rifiutare il file.
- **Scala a U**: due rampe affiancate (stesso passo, vuoto fino a 0,45 m in mezzo) che finiscono dalla stessa parte diventano **una scala a U** con numero di alzate totale e della prima rampa, larghezza di ciascuna rampa, vuoto in mezzo e pianerottolo (quanto il disegno è più lungo della prima rampa). Il verso del disegno si trova provando le 8 combinazioni di rotazione e specchio e prendendo quella che mette le alzate sulle righe del disegno. Nel DXF vero dello studio le due «scale» erano una U da 11 + 9 alzate. La prima rampa è la più lunga: se in realtà si sale dall'altra parte, si gira dal pannello della scala. La larghezza della rampa è quella delle righe normali (prima una riga più lunga, come la linea di fine rampa, la allargava).
- Le scale di righe tornano con numero, passo, larghezza e ingombro uguali al disegno in tutti e quattro i versi; il **verso di salita non si legge dal DXF** (si gira dal pannello della scala).
- Formato dei rilievi invariato. Prova nuova `dxf2` (compresa la scala a U in 5 versi); `dxf`: cambia solo «layer ricordati» (ora vuoto se non cambi niente).

## 24 novembre 2026 — Seleziona: più muri con i tocchi
- Con «Seleziona» attivo, un tocco sceglie un muro come sempre. Un secondo tocco su un altro muro li sceglie insieme (selezione multipla), e si possono aggiungere altri muri o toglierne uno ritoccandolo.
- Con più muri scelti compaiono i comandi della selezione multipla, compreso «Elimina» (si annulla con «Annulla»). Per sceglierne uno solo diverso, tocca prima un punto vuoto.

## 23 novembre 2026 — Porta strombata (e a scalino)
- Nell'elenco delle porte c'è la voce «Strombata», scelta indipendente come per le finestre (non è un'opzione del menu delle porte). Una volta posata, nel pannello c'è «Forma» (normale, a scalino, strombata), con parte larga, risega e lato largo; vale anche per ingresso e varco.
- L'anta e l'infisso stanno nella parte stretta: se il cardine cadrebbe sulla faccia larga, va sul fondo della parte stretta. I cunei della strombata tornano muro come per le finestre.
- Nessun dato cambia: si usano gli stessi campi delle finestre (`inc`, `l2`, `ris`, `lw`).

## 23 novembre 2026 — Muro spostato di lato (denti)

- Nel pannello del muro dritto c'è «Sposta il muro di lato (m)»: + in alto o a destra, − in basso o a sinistra. Il muro scorre
  parallelo a se stesso, i muri attaccati si allungano o si accorciano; le loro misure scritte restano come sono e non
  danno falsi «non torna». I m² e il perimetro della stanza seguono il disegno. Vuoto = nessuno spostamento (prova «dente»).
- Se il muro continua in linea con un altro (per esempio diviso da un tramezzo), allo spigolo nasce da solo un tratto di raccordo dello
  stesso tipo che chiude il dente. Il raccordo esiste solo finché c'è lo spostamento: togliendolo sparisce e tutto torna com'era.
- Dati: campo nuovo e facoltativo `dm` sul muro (e `sx`, `sy` sui nodi, solo di servizio): i rilievi vecchi si aprono come prima.

## 17 novembre 2026 — Superfici esterne disegnate come i muri

- Nuovo tipo di muro «Superficie esterna» (linea gialla sottile, 2 cm, layer «Superfici esterne»): si disegna con
  lo stesso strumento dei muri (tratto, misure, spostamenti, tipo cambiabile). Chiuso, anche contro il muro di casa,
  forma un ambiente con i suoi m² come tutti gli altri.
- Destinazioni nuove dell'ambiente: Portico, Marciapiede, Terrazzo, Balcone (fuori dai calcoli di rapporto aeroilluminante).
- Script AutoCAD: le linee escono nel layer PLAN_SUPERFICI (giallo); i m² escono con il testo dell'ambiente.
- Il bottone «Superficie» a punti (tappe 2 e 3 di oggi) è sostituito da questo; il vecchio codice resta nel file ma non si raggiunge.
- Non ancora: sfrido %, portico tratteggiato, marciapiede ad anello attorno alla casa (area con la casa tolta).

## 18 novembre 2026 — Superfici esterne: anello attorno alla casa, tolti sfrido e portico

- Marciapiede, terrazzo e balcone non hanno più l'altezza: sparisce dal pannello e dalla tabella Calcoli (niente volume né controllo altezza).
- Marciapiede ad anello attorno alla casa: disegnato come anello di «Superficie esterna», l'area esce già senza la casa
  e le stanze della casa restano riconosciute (prova «anello»).
- Tolti: lo sfrido, il portico (resta la destinazione Marciapiede, Terrazzo, Balcone) e il vecchio strumento a punti
  con il suo codice. Le superfici fatte con quel vecchio strumento non si vedono più.

## 17 novembre 2026 — Superfici esterne nello script AutoCAD (tappa 3)

- Se il piano ha superfici, lo script crea il layer **`PLAN_SUPERFICI`** (giallo, spessore 0,13). Senza superfici lo script resta identico a prima.
- **Marciapiede**: polilinea chiusa continua. **Portico**: linee a tratti (0,10 pieno, 0,06 vuoto, come le scale), non dipende dai tipi di linea caricati.
- Testo sul lato più lungo: «PORTICO S = 12.60 mq» o «MARCIAPIEDE S = ... mq» e, se lo sfrido è scritto, «con sfrido 10% = ... mq».
- Prova `superfici` ampliata: layer, tratti e testi nello script.

## 17 novembre 2026 — Superfici esterne: portico e marciapiede (tappa 2)

- Nuovo strumento **«Superficie»** (accanto a «Ringhiere» in Muri). Scegli **Marciapiede** (linea continua) o **Portico** (tratteggiato), tocchi i punti del contorno (agganciano spigoli e facce dei muri), poi **Fine**. Contorno e riempimento gialli, nome e mq scritti sul lato più lungo.
- **Chiusura lungo i muri**: se primo e ultimo punto stanno sullo stesso muro, l'app mostra i percorsi possibili in colori diversi (con i mq di ciascuno) e scegli tu; oppure «Linea dritta». Se i punti non sono su un muro, chiude con una linea dritta.
- **Anello attorno alla casa**: tornando sul primo punto l'app propone di togliere la casa (contorno più esterno dei muri); scegli «Sì» o «No». Si può togliere dopo dal pannello. Mq = contorno − casa.
- Pannello a destra: tipo, **sfrido %** (scritto da te; proposto 10, si ricorda l'ultimo), mq netti e con sfrido, perimetro e **lunghezza di ogni lato**: scrivendola si sposta il punto dopo (e i successivi), il lato che chiude si adegua.
- Dati: nuova lista `pl.sup` nel piano, vuota nei rilievi vecchi (nessuna conversione). Nello script: vedi la voce sopra.
- Prova `superfici`: portico 2 × lato alto, anello 1 m attorno alla casa, sfrido, lato scritto, tratteggio.

## 17 novembre 2026 — Ringhiere (tappa 1 di superfici esterne)

- Nuovo **tipo di muro «Ringhiera»**: tasto «Ringhiere» in Muri, voce nel tipo del muro e nei muri selezionati. Rossa e sottile in pianta, **spessore 5 cm** (modificabile) e **altezza** (proposta 1,00 m, la scrivi tu) nel pannello del muro.
- Chiude un balcone come un muro normale: l'ambiente racchiuso dà i suoi mq. Nessun layer nuovo: nell'app seguono il layer «Porte e finestre» (acceso/spento e blocco) e nello script vanno su `PLAN_INFISSI_TESTI` (rosso).
- I rilievi vecchi non cambiano: il tipo nuovo si aggiunge solo quando lo scegli. L'altezza è salvata nel muro (`h`), non ancora usata dalla sezione.
- Ancora da fare: portico e marciapiede (superficie con mq e sfrido, chiusa dai muri della casa) e il loro layer nello script.
- Prova `ringhiera`: balcone 3 × 2 chiuso da 3 ringhiere, layer, script e pannello.

## 16 novembre 2026 — Importa DXF, correzione: scale a righe singole

- Le scale disegnate come **righe singole** a passo 0,18–0,40 m (come nel disegno vero: righe larghe quanto la scala, linea di mezzo, taglio obliquo)
  non venivano riconosciute: a passo 0,30 le coppie di righe sembravano muri perimetrali. Ora ≥3 righe con un estremo in comune diventano una scala dritta;
  linea di mezzo, lati e taglio obliquo entrano nella scala e non sono più muri.
- Due tratti separati da un vuoto restano **due scale** (prima venivano uniti in una sola). Nel disegno di prova le scale sono ora 4.
- Gli **scalini d'ingresso** disegnati come «U» annidate (una dentro l'altra, aperte verso il muro) non diventano più un muro sbagliato sotto la finestra: vengono ignorati. Una «U» sola (testa di muro) resta com'era.
- **Importa DXF su nuovo piano**: dopo la scelta dei muri ci sono due pulsanti, «Su nuovo rilievo» (come prima) e «Su nuovo piano di <rilievo aperto>». Il secondo aggiunge un piano al rilievo aperto (chiede il nome) e lascia gli altri piani com'erano. I piani importati usano la stessa origine del primo DXF, così, se i disegni hanno le stesse coordinate, restano sovrapposti. Per un rilievo non nato da DXF l'origine è l'angolo del disegno.
- Nel disegno di prova: scale riconosciute da 1 a 3, muri da 55 a 45 (le righe delle scale non sono più muri).
- Prova `dxf`: attesi rigenerati.

## 16 novembre 2026 — Importa DXF, tappa 3: scale, balconi e pergolato

- **Scale**: i gradini in fila (3 o più coppie uguali, a passo regolare, sul layer dei tramezzi) diventano una **scala dritta** del rilievo, nello stesso posto,
  con larghezza, passo e numero di alzate del disegno (solo proposte). Il verso di salita non si legge dal DXF: si gira dal pannello della scala.
  Solo scale dritte e con le linee sugli assi; scale a L, a U o curve per ora no.
- **Balconi e pergolato** (muri dei tramezzi fuori dalla casa): non sono più lasciati da parte, entrano come muri col loro spessore (0,15, 0,20, 0,25…).
  Nell'anteprima sono **viola** e si scartano con un tocco come gli altri; le scale sono in verde acqua e si scartano allo stesso modo.
- Pezzi sciolti (travi, pilastri) restano muri non collegati: vanno scartati a mano se non servono.
- Prova `dxf`: attesi rigenerati (balcone dentro, scala dritta con 5 gradini).

## 16 novembre 2026 — Importa DXF, tappa 2: porte, finestre e varchi

- L'importazione legge anche **archi** e **blocchi** (INSERT, aperti come linee; scala e rotazione rispettate) e riconosce le aperture sul layer degli infissi:
  **finestre** (le linee del layer dentro lo spessore del muro, riunite), **porte-finestre** (la finestra con una linea che attraversa il muro),
  **porte** (arco di circa 90°: cerniera e verso di apertura dall'arco) e **varchi** (buco del muro senza nessun infisso).
- Posizione come quando si posa a mano; **larghezza e distanza restano solo proposte** (nessuna misura scritta). Aperture sui muri obliqui: per ora non importate.
- Anteprima con riquadri colorati e conteggio; le aperture dei muri scartati non vengono create.
- Il **tipo di muro si decide dallo spessore** (0,30 perimetrale, 0,10 tramezzo, altri spessori restano con il loro valore), non più solo dal layer: va bene anche
  quando i muri spessi stanno sul layer giallo. Il controllo «fuori dalla casa» usa tre punti del muro. Corretto un errore con i muri cortissimi (pilastri).
- Prova `dxf` estesa: finestra, porta-finestra, porta ad arco, varco e un blocco nel DXF inventato.

## 16 novembre 2026 — Importa DXF, tappa 1: muri e tramezzi

- Nuovo tasto **Importa DXF** (accanto a «Importa»). Carichi un DXF di una pianta e l'app crea un **rilievo nuovo** nell'Archivio, con un solo piano:
  muri e tramezzi al loro posto, collegati, spostabili e modificabili come quelli disegnati a mano. **Nessuna misura scritta**: le caselle restano vuote e
  la pianta si aggiusta quando scrivi le tue misure sul posto.
- **Unità**: il file non è affidabile (può dire millimetri ed essere in metri). L'app mostra quanto viene grande la casa in metri, centimetri e millimetri
  e propone l'unità che dà una casa tra 3 e 60 m.
- **Layer**: elenco con colore, numero di oggetti e «Cosa contiene»: Muri perimetrali / Tramezzi e scale / Infissi e ringhiere / Ignora. Proposta per nome
  (PLAN_MURI_PERIM, PLAN_MURI_INT, PLAN_INFISSI_TESTI), poi per colore (7, 2, 1); i layer «0» e Defpoints vanno su Ignora. Le scelte restano sul dispositivo
  (`rilievo-dxf-layer`).
- **Muri**: coppie di linee parallele a 0,05–0,60 m che si sovrappongono; il muro è la linea di mezzo con lo spessore trovato. Spessore uguale a 0,30 / 0,10
  (±0,02) → perimetrale / tramezzo, altrimenti muro con il suo spessore. Spigoli e incroci a T ricuciti sulla linea di mezzo; muri obliqui oltre 1,5° dagli assi.
  Il buco di una porta o finestra (fino a 3 m, linee interrotte) lascia il muro continuo: le aperture arrivano nella tappa 2.
- **Lasciati da parte** (tappa 3): gradini della scala (3 o più coppie uguali in fila) ed elementi dei tramezzi fuori dal perimetro (balconi, pergolato).
  Le linee senza coppia (da 0,65 m in su) si scartano e si contano; blocchi (INSERT) non letti.
- **Anteprima** prima di creare il rilievo: muri colorati, conteggi, tocco su un muro per scartarlo, poi «Crea rilievo» o «Annulla».
- Formato dei rilievi invariato. Prova nuova `dxf` con il DXF inventato `test/casa-finta.dxf`.

## 15 novembre 2026 — sezione, tappa 1: solaio di calpestio e altezza di tutti i vani

- Impostazioni, nuova scheda **Solai**: per ogni piano lo spessore del solaio di calpestio (quello su cui si
  cammina in quel piano). Il soffitto di un piano è il calpestio del piano sopra. Serve per la sezione.
- **Altezza** anche per porte, ingressi e varchi (prima solo finestre e porte-finestre). Entra nella tabella
  della scheda PDF; la superficie finestrata resta solo di finestre e porte-finestre.
- Rilievi vecchi: le caselle nuove partono vuote, nessuna conversione.
- Prova nuova `solai`.

## 15 novembre 2026 — scheda del rilievo, tappa 3: ambienti, porte e finestre, note e foto

- Dopo la pianta di ogni piano, una pagina con le tabelle del piano:
  - **Ambienti**, come nella scheda Calcoli: superficie netta, perimetro, altezza, volume, superficie finestrata,
    rapporto, RAI e altezza (ok / no), con il totale del piano.
  - **Porte e finestre**: tra quali ambienti stanno (o verso l'esterno), tipo, larghezza, altezza e davanzale.
    Una larghezza non ancora scritta compare come «da misurare».
  - **Note** scritte con «Testo» (le note a mano restano nella pianta).
- In fondo le **foto**, quattro per pagina, ridotte a 1400 px. Didascalia: numero (lo stesso del segnaposto in pianta,
  contato piano per piano), piano, ambiente e nome della foto.
- Mentre prepara la scheda il tasto dice «Preparo la scheda…». Prova `scheda2` aggiornata (5 foto finte e una nota).

## 15 novembre 2026 — scheda del rilievo, tappa 2: tasto «Scheda PDF»

- Nella barra in alto, accanto a «Esporta», il tasto **Scheda PDF**: prepara la scheda in A4 verticale e apre la
  stampa di Chrome; si sceglie «Salva come PDF». Funziona anche senza internet.
- Ogni pagina ha in alto l'intestazione dello studio e, a destra, «Scheda di rilievo», nome e data. La prima pagina ha i
  **dati della pratica** (nome, indirizzo, data, foglio, particella, subalterno, piani rilevati).
- **Una pagina per piano** con la pianta come nell'app (misure, nomi e m², porte e finestre, scale, note, nord), in
  colori chiari anche con il tablet in modalità scura, senza griglia, senza selezioni e con la vista non girata.
  I piani senza niente disegnato non hanno pagina. In fondo: «Schizzo di rilievo, non in scala». Prova `scheda2`.

## 15 novembre 2026 — scheda del rilievo, tappa 1: dati catastali e intestazione dello studio

- In Impostazioni → Rilievo ci sono le caselle **Foglio**, **Particella** e **Subalterno** (vanno nel file esportato).
  Nei rilievi già salvati restano vuote.
- Nuovo riquadro **Intestazione dello studio**: il testo che andrà in alto nella scheda. Parte già scritto con i dati
  dello studio; si cambia lì e vale per tutti i rilievi di questo dispositivo. Prova `scheda`.
- Tolte le prove `sfalsa` e `tasti`: provavano due funzioni («Sfalsa il muro» e i tastini a filo/in asse) che non sono
  mai entrate nell'app. Restano nello storico di GitHub.

## 14 novembre 2026 — sagoma di un altro piano e «Allinea questo piano alla sagoma»

- Nuovo layer **Sagoma altro piano** (👁 acceso/spento, senza lucchetto): mostra tratteggiati e chiari, sotto il
  disegno, i muri perimetrali di un altro piano. Nel pannello Layer si sceglie il piano (sopra o sotto, qualsiasi);
  senza scelta vale il piano più vicino nell'elenco che ha muri perimetrali, prima quello sotto. Non va nello script.
- Ogni piano ha la sua posizione nell'edificio (`pl.org`): quando il piano si ricentra sullo spigolo in basso a
  sinistra l'origine si sposta con lui, così il piano resta fermo rispetto agli altri.
- Disegnando muri perimetrali la penna si aggancia agli spigoli e alle linee dei muri della sagoma (prima ai muri del
  piano stesso). Non è un vincolo: con le misure i muri vanno dove devono e si vedono le differenze tra i piani.
- **Allinea questo piano alla sagoma**: si tocca uno spigolo del piano aperto e lo stesso spigolo sulla sagoma; cambia
  solo la posizione del piano, le misure no. Si torna indietro con Annulla. «Adatta» inquadra anche la sagoma.
- La scala e i muri del vano riportati in un altro piano tengono conto della posizione dei piani. Prova `sagoma`.

## 13 novembre 2026 — scale: rampe di larghezza diversa e pianerottoli su misura

- Nel pannello della scala ogni rampa ha la sua larghezza (2ª, 3ª, 4ª rampa; vuote = come la 1ª), per le scale a L,
  a U e attorno all'ascensore. Il controllo della larghezza minima guarda la rampa più stretta.
- Pianerottolo intermedio su misura: nella scala a L profondità e larghezza (le rampe restano sui lati esterni);
  nella U profondità e larghezza (scritta la larghezza, la distanza tra le rampe si ricava); attorno all'ascensore con
  2 rampe la profondità del pianerottolo in fondo. Gli angoli attorno all'ascensore seguono le larghezze delle rampe.
- Nuovi **pianerottolo di partenza** (prima della prima alzata) e **di arrivo/smonto** (dopo l'ultima), con casella,
  profondità e larghezza (vuote = come la rampa). Se più larghi della rampa si allargano verso il centro della scala
  (dalle due parti nella dritta). Linea continua, con la stessa regola del taglio a 1,40 m del resto della scala;
  vanno nello script. Non spostano la scala e non entrano nel suo ingombro. Con il varco, la scala sbarca sul bordo
  del pianerottolo di arrivo. La chiocciola resta com'era. Prova `pianer`.

## 12 novembre 2026 — diagonale rossa: «Sistema inclinando un muro»

- Nel pannello della diagonale che non torna c'è il tasto **Sistema inclinando un muro**: tocchi in pianta il muro da
  inclinare (quelli della stanza sono evidenziati) e scegli quale estremo si sposta (freccia in pianta o riga nel pannello).
  L'altro estremo resta fermo; quello scelto scorre lungo il muro che incontra, di quanto serve perché la diagonale torni.
- Prima di applicare il pannello dice di quanto si sposta lo spigolo e quali misure cambiano: i lati lungo il muro su
  cui scorre che finiscono in quello spigolo, **anche nella stanza vicina**, diventano ricavati (con il valore nuovo);
  così le misure delle stanze accanto non vanno in rosso. Anche l'ultima parziale dei vani e il totale di facciata che
  arrivano in quello spigolo diventano ricavati. La misura del muro presa dall'altra stanza si toglie (un muro obliquo
  ha una sola lunghezza); la sua lunghezza resta come controllo.
- Gli estremi che non sistemano la diagonale (non sono un suo spigolo), che finiscono contro un obliquo o dove il muro
  prosegue dritto si vedono con ✕ e il motivo. Spostamenti oltre 20 cm e avvisi nuovi sono segnalati prima.
- Applicato, la pianta mostra già il risultato: **Conferma** o **Annulla** (torna dritto, misure come prima, e puoi
  scegliere l'altro estremo o un altro muro). I nomi degli estremi seguono la vista girata.
- Le distanze misurate (diagonali e lunghezze degli obliqui) entrano nell'ordine in cui le hai prese anche quando ne
  cadono più d'una tra due misure dei lati. «Rendi la stanza fuori squadra» resta. Prova `inclina`.

## 12 novembre 2026 — layer, tappa 1: layer fissi (accendi, spegni, blocca)

- Nella barra di Zoom/Adatta il tasto **Layer** (al posto di «Nomi e m²», che ora è un layer) apre il pannello a destra
  con i layer dell'app: muri perimetrali, tramezzi, porte e finestre, scale e ascensore, quote e misure, nomi e m²,
  note a mano, disegno (linee), linee di costruzione, foto, sfondo, nord. Per ognuno 👁 (acceso/spento) e 🔒 (bloccato);
  in fondo «Accendi tutti» e «Sblocca tutti». Il pannello resta aperto anche usando gli strumenti della barra.
- **Spento**: non si vede e non si tocca. **Bloccato** (come AutoCAD): si vede e gli snap lo agganciano, ma non si
  seleziona, non si sposta, non si cancella con la gomma, non si apre il pannello; su muri bloccati non si posano
  porte e finestre; con «Quote e misure» bloccato le caselle delle misure non si aprono.
- Lo stato dei layer resta nel rilievo. Lo **script AutoCAD esce sempre completo**, anche con layer spenti.
- «Nascondi costr.» (menu Disegno) e il layer «Linee di costruzione» sono la stessa cosa. Prova `layer`.
- In arrivo (tappa 2): layer tuoi, creati con un nome, per note e linee disegnate.

## 12 novembre 2026 — gradini ritoccati a mano (scale dritta, a L, a U, attorno all'ascensore)

- Nel pannello della scala, sezione **Gradini**: «✎ Modifica gradini». Su ogni alzata compaiono tre pallini:
  ● agli estremi (si trascina un estremo: l'alzata va in diagonale, per i gradini a ventaglio) e ■ al centro (si sposta
  l'alzata intera, parallela). Gli estremi si agganciano a quelli delle altre alzate, agli spigoli della scala e ai fianchi
  della rampa; il ■ si aggancia all'asse centrale della rampa (entro 14 px), così l'alzata resta in linea con le altre. In modifica il resto della scala non si sposta toccandola; «✓ Fine modifica» per uscire.
- Toccando un pallino senza trascinare si scrivono le **pedate sui due lati** (lato sinistro e destro salendo, distanza
  dall'alzata prima lungo il fianco): l'alzata si mette da sola. La prima alzata di una rampa si sposta solo trascinando.
- Le alzate ritoccate restano bloccate (cambiando pedata o larghezza non si muovono), sono un po' più marcate in pianta
  e passano alla stessa scala negli altri piani (anche con «Riporta al piano superiore»). «Ripristina questa alzata» e
  «Ripristina tutti». Cambiando tipo di scala i ritocchi si tolgono (con avviso; Annulla li riporta).
- Controlli sui gradini ritoccati: 2a + p sulla linea di passo (a metà larghezza) e, se impostata nelle Impostazioni
  («Scale: pedata minima sul lato interno»), la pedata minima sul lato interno. La chiocciola resta senza ritocchi.
- La scala non si sposta quando ritocchi i gradini (la posizione viene dalla forma con i parametri). Numeri, taglio a
  1,40 m e script seguono le alzate ritoccate. Prova `scalegr`.

## 12 novembre 2026 — scale e ascensore, tappa 3: ascensore da solo

- Nel pannello «Scale e ascensore» c'è **Ascensore**: blocco completo con le pareti del vano (riempite come i muri),
  porta di piano al centro di un lato, cabina con la croce. Si posa come le scale e si accosta ai muri attorno.
- Pannello dell'ascensore: larghezza e profondità interne del vano, spessore delle pareti, larghezza della porta;
  «Ruota 90°» gira la porta su un altro lato; «Riporta al piano superiore / su tutti i piani sopra», anche con i muri attorno.
- Il vano si toglie dalla superficie calpestabile; non entra nella tabella delle scale nei Calcoli.
- Script come per la scala attorno all'ascensore (pareti sul layer dei muri perimetrali, il resto sul layer dei tramezzi).
  Prova `lift`.

## 12 novembre 2026 — scale e ascensore, tappa 2: scala attorno all'ascensore

- Nuovo tipo di scala **«Attorno all'ascensore»** (pannello Scale): le rampe girano attorno al vano dell'ascensore,
  con i pianerottoli negli angoli. Nel pannello della scala:
  - **Rampe**: 2 (a U, pianerottolo in fondo), 3 (il lato della porta dell'ascensore resta libero), 4 (tutti i lati);
  - **Alzate per rampa** (es. 7-4-7): se lasci vuoto si dividono in parti uguali; se le scrivi, il totale si aggiorna;
  - **vano ascensore**: larghezza e profondità interne, spessore delle pareti, larghezza della porta e lato della porta
    (verso l'ingresso, il fondo, la prima o l'ultima rampa).
- La prima rampa arriva all'angolo (lo spazio in più resta all'ingresso), le altre partono dal pianerottolo. Se una rampa
  è più lunga del lato del vano, il riquadro della scala lo dice («Rampa 1: … il lato del vano ascensore è …»).
- Ascensore al centro come blocco completo: pareti del vano (riempite come i muri) con il vano porta, cabina con la croce,
  porta di piano scorrevole. Il vano dell'ascensore si toglie dalla superficie calpestabile a tutti i piani.
- Taglio a 1,40 m, piano intermedio, numeri delle alzate, freccia SALE/SCENDE e varco come le altre scale.
- Script: pareti del vano sul layer dei muri perimetrali (portanti), cabina, croce, porta e scala sul layer dei tramezzi.
  Prova `scasc`.

## 11 novembre 2026 — scale e ascensore, tappa 1: pannello Scale

- Il tasto **Scala** apre il pannello «Scale e ascensore» a destra, come Porte e Finestre: dritta, a L, a U, a chiocciola.
  Si posa il tipo scelto (prima si posava sempre dritta e si cambiava dopo). Il pannello resta aperto; si chiude con
  la ✕, con Esc o con un altro strumento. Con il pannello aperto le caselle delle misure si toccano lo stesso.
- In arrivo: scala attorno all'ascensore (2, 3 o 4 rampe, scelte nel pannello) e ascensore da solo (blocco completo
  con le pareti del vano). Prova `scalepan`.

## 11 novembre 2026 — tipi di porta e pannelli Porte / Finestre (stile ArcSite)

- Nella barra, al posto di «Aperture», due tasti: **Porte** e **Finestre**. Ognuno apre un pannello di scelta a destra
  della tavola, con l'icona di ogni tipo. Il pannello **resta aperto**: scegli il tipo, appoggi la penna sul muro e
  trascini, poi puoi posarne altre. Si chiude con la ✕, con Esc o scegliendo un altro strumento della barra. Con il
  pannello aperto le caselle delle misure si toccano lo stesso; «Adatta» lascia la pianta a sinistra del pannello.
- **Porte**: battente (un'anta), doppia anta, anta e mezza (2/3 + 1/3), scorrevole esterna, a scomparsa, a libro,
  ingresso (portoncino), varco senza infisso. Il tipo si cambia anche dopo, nel pannello del vano («Apertura»).
  - doppia anta e anta e mezza: due ante con l'arco, come il blocco dello studio; ⇅ apre dall'altro lato,
    ⇄ (anta e mezza) mette l'anta grande dall'altra parte;
  - scorrevole esterna: anta (4 cm) sulla faccia del muro, chiusa sul vano con 5 cm di sormonto, e freccia verso
    dove scorre; ⇄ cambia il verso, ⇅ la faccia; avviso se da quella parte il muro è più corto dell'anta;
  - a scomparsa: anta tratteggiata dentro il muro (controtelaio) dalla parte dove scorre; ⇄ cambia il verso;
    avviso se il muro non basta o se è più sottile di 0,10 m;
  - a libro: due pannelli piegati a V.
- **Finestre**: finestra, porta-finestra, incassata a scalino, incassata strombata. Disegno e script come prima.
- Script: le porte nuove escono sul layer degli infissi (polilinee e archi; la scomparsa a tratti come le scale sopra
  il taglio). Barra principale un po' più stretta, così con i due tasti nuovi resta su una riga. Prova `porte`.

## 11 novembre 2026 — muri obliqui, tappa 4: quote degli obliqui nello script

- Nello script AutoCAD le facce dei muri obliqui verso gli ambienti escono come **quote allineate** (`_.DIMALIGNED`,
  stesso stile di quota dello studio), con la linea di quota a 0,40 m dentro la stanza: tutta la faccia se il muro non ha
  vani, i tratti spigolo → vano → vano → spigolo se li ha. Su un tramezzo obliquo tra due stanze, una quota per faccia.
- Si quotano solo i muri obliqui misurati o ricavati dalle misure (lunghezza, parziali, diagonali, rientro); gli altri
  si contano nella riga «Quote parziali: … tratti senza misura» in testa allo script.
- Un muro obliquo fissato da tutte le sue parziali non viene più contato tra i «muri senza misure». Prova `scrobl`.

## 11 novembre 2026 — muri obliqui, tappa 3: porte e finestre sui muri obliqui

- Tutte le aperture (porta, finestra, porta-finestra, ingresso, varco, incassata a scalino e strombata) si posano anche
  sui muri obliqui, con il tasto o dal pannello del muro obliquo («+ Porta o finestra»). Il vano ha le spalle
  perpendicolari al muro; porta con anta e arco, ⇄ e ⇅ come sui muri dritti.
- **Parziali lungo la faccia**: in pianta, sulla faccia verso la stanza, le caselle spigolo → vano → vano → spigolo
  (linea di quota parallela al muro) e la larghezza sulla linea che esce dal vano. Su un tramezzo obliquo tra due
  stanze le parziali si possono prendere da tutti e due i lati. Entrano in «Prossima».
- Se tutte le parziali di una faccia sono misurate (e le larghezze), la loro somma è la **lunghezza del muro obliquo**
  (come scriverla nel pannello): fissa il muro con Pitagora o la trilaterazione. Se il muro è già fissato dalle misure
  prese prima, l'ultima parziale fa da controllo e l'avviso dice di quanto non torna.
- «Rendi obliquo» e «Rendi la stanza fuori squadra» funzionano anche sui muri con aperture: le parziali già prese
  passano sulla faccia del muro obliquo (se il lato era solo quel muro; altrimenti l'app dice quali riscrivere).
- Script: infissi e anta delle porte sui muri obliqui; la larghezza del vano esce perpendicolare al muro con il testo
  ruotato lungo la linea.
- Correzione (dalla tappa 1): se lo schizzo di un muro obliquo era molto diverso dalla misura (qualche %), l'app poteva
  non applicare la lunghezza misurata. Ora la applica. Prova `apobl`.

## 11 novembre 2026 — muri obliqui, tappa 2: diagonali, rientro, fuori squadra

- Menu **Quota** (come Note e Disegno, così la barra resta su una riga): «Quota» e «Diagonale».
- **Diagonale**: tocchi uno spigolo della stanza e quello opposto, scrivi la misura.
  Se le altre misure fissano già tutto è un **controllo** (tolleranza 3 cm); se non torna l'avviso dice di quanto e
  che la stanza può essere fuori squadra. Se c'è un muro obliquo, la diagonale lo mette al suo posto: Pitagora
  quando una componente è già nota, **trilaterazione** (incrocio di due cerchi) quando un angolo ha due distanze
  misurate da punti già fissati. Nello script esce come quota allineata.
- **Fuori squadra**: nel pannello della diagonale che non torna, «Rendi la stanza fuori squadra» rende obliqui i
  muri della stanza tranne il più lungo (riferimento dritto); le misure dei loro lati diventano le lunghezze dei
  muri obliqui; con 4 lati + 1 diagonale la stanza prende gli angoli veri. L'app non ruota mai i muri da sola.
  I muri con porte o finestre restano dritti (aperture sugli obliqui: prossima tappa).
- Pannello del muro dritto: «Rendi obliquo»; pannello del muro obliquo: «Rendi dritto».
- **Rientro** (pannello del muro obliquo): di quanto il muro si sposta da un capo all'altro, lungo la faccia
  interna (il cateto corto). Vincolo diretto, con la correzione tra faccia e asse.
- Vale sempre l'ordine delle misure: quelle prese dopo che non tornano restano NON APPLICATE. Prova `diagonali`.

## 11 novembre 2026 — obliqui senza gradini

- Correzione (video di Simone): tirando un muro obliquo vicino agli spigoli di altri muri, l'aggancio agli
  allineamenti (come il puntamento di AutoCAD) bloccava per un tratto la penna in orizzontale o in verticale e il
  muro veniva a gradini (obliquo, pezzetto dritto, obliquo). Ora, quando il lato in corso è chiaramente obliquo,
  l'aggancio agli allineamenti si spegne; a fine tratto i gradini corti (meno di 30 px) attaccati a un obliquo
  vengono assorbiti e due obliqui quasi in linea diventano uno. Gli estremi si allineano ancora agli spigoli
  vicini. I muri dritti si agganciano come prima. Prova `gradini`.

## 11 novembre 2026 — muri obliqui, tappa 1 (copia di sicurezza sul Desktop: «Rilievo backup 11-11-2026 (prima degli obliqui)»)

- Disegnando, un tratto inclinato di più di 10° dagli assi resta **obliquo** (sotto i 10° si raddrizza come sempre).
  Vale per perimetrali e tramezzi; un obliquo si divide dove incrocia altri muri (anche a X) e gli altri muri si
  dividono dove lo incontrano.
- Spessore, spigoli vivi e attacchi giusti anche con gli obliqui; ambienti e superfici esatte anche con lati
  inclinati. Se nel piano c'è almeno un obliquo, ambienti e contorni si calcolano a poligoni (libreria
  polygon-clipping, MIT, dentro l'app); i rilievi tutti dritti usano la griglia di sempre (identici a prima).
- **Misura**: casella sulla faccia del muro obliquo (o pannello «Muro obliquo»: lunghezza e su quale faccia:
  interna verso la stanza, esterna, asse). La lunghezza fissa il «cateto» che le misure prese prima lasciano
  libero (Pitagora); se i cateti sono già fissati è un controllo (rossa se non torna). Vale l'ordine delle
  misure: le misure prese dopo che non tornano restano NON APPLICATE. Entra anche in «Prossima».
- Il pannello mostra l'inclinazione e le lunghezze delle due facce. I lati dritti che finiscono contro un obliquo
  si misurano fino alla sua faccia.
- Non ancora (tappe dopo): diagonali e rientro (fuori squadra), porte e finestre sui muri obliqui, quote degli
  obliqui nello script. Prova `obliqui`.

## 11 novembre 2026 — gruppo Disegno e tappa 3: Taglia ed Estendi

- Linea, Costruzione, Parallela, Taglia, Estendi e «Nascondi/Mostra costr.» stanno in un gruppo a parte,
  **Disegno**, accanto a Note (che torna ad avere solo A mano, Testo e Gomma).
- **Taglia**: tocchi il pezzo di linea da togliere; si taglia fino agli incroci con le altre linee (fra due incroci
  la linea si divide in due). Se la linea non incrocia niente, non taglia e te lo dice.
- **Estendi**: tocchi la linea vicino alla fine da allungare; arriva fino alla prima linea che incontra.
- Valgono per le linee dritte (Linea, Costruzione, parallele); le note a mano libera no. Le costruzioni nascoste
  non contano. Tagliata o estesa, la linea perde la lunghezza scritta. Prova `taglia`.

## 11 novembre 2026 — strumenti per disegnare, tappa 2: Parallela

- **Parallela** (gruppo Disegno): tocchi una linea (si colora di blu), poi tocchi dal lato dove va la parallela e scrivi
  la distanza. La nuova linea ha la stessa lunghezza ed è dello stesso tipo (Linea o Costruzione). La linea d'origine
  resta scelta: puoi farne altre (es. 3,10 e 6,20 dalla linea di terra) senza ritoccarla. Le distanze sono sempre
  dalla linea d'origine. «Annulla» toglie l'ultima. Prova `paral`.

## 11 novembre 2026 — strumenti per disegnare (prospetto sulla pianta), tappa 1

- **Linea** e **Costruzione**, più «Nascondi/Mostra costr.» (dall'11 novembre nel gruppo Disegno).
- Linea: trascini la penna da dove parti a dove arrivi; si aggancia a spigoli dei muri, estremi e incroci delle
  linee (quadratino blu), a un punto sopra una linea o sulla faccia di un muro; va dritta in orizzontale/verticale
  (o a multipli di 15°) e, se passa su una linea, si ferma all'incrocio. Appena posata si apre il tastierino per la
  lunghezza: resta fermo il punto da cui sei partito. Selezionata, mostra la lunghezza e nel pannello si cambia
  lunghezza o tipo.
- Costruzione: stesse regole, tratteggiata grigia, serve solo per agganciarsi (proiezioni dalla pianta); non va
  nello script e si nasconde col tasto.
- Script: le Linee vanno sempre, sul layer delle note a mano; le note a mano libere solo con l'opzione di sempre.
- Prova `linee`.

## 11 novembre 2026 — «Incassata» tra le aperture

- Le finestre incassate si posano col tasto **Incassata** in Aperture (accanto a Finestra, Porta-finestra, Porta,
  Ingresso), come le altre: nascono a scalino, con la parte larga verso la stanza.
- Nel pannello la casella «Forma» (A scalino / Strombata / Normale) compare solo sulle finestre incassate; le finestre
  normali non ce l'hanno più. Il titolo del pannello dice «Finestra incassata». Prova `incassata` aggiornata.

## 10 novembre 2026 — finestre incassate (palazzi antichi)

- (Dall'11 novembre si posano col tasto «Incassata», vedi sopra.) Forma: A scalino / Strombata. La finestra ha due larghezze: la **luce**
  (parte stretta, dove sta l'infisso: è la larghezza che conta per il rapporto aeroilluminante) e la **parte larga**.
- La parte stretta è profonda 0,15 m dalla sua faccia (Impostazioni → «Finestre incassate: profondità della luce
  stretta»); il resto dello spessore è la parte larga. A scalino: due rettangoli. Strombata: i fianchi vanno in
  obliquo dal bordo largo al bordo della luce (anche nei contorni dei muri dello script).
- La parte larga sta di partenza verso la stanza; si gira con «⇅ Parte larga dall'altro lato» nel pannello o col
  tasto tondo accanto alla finestra selezionata.
- Misure: in pianta la casella della luce sta dalla sua faccia e quella della parte larga dall'altra (proposta
  20 cm per lato finché non la misuri). Le parziali sulla faccia larga arrivano al bordo largo. La **risega**
  (dal bordo largo al bordo della luce, a sinistra o in basso) si scrive nel pannello o con «Prossima»; senza
  risega la luce resta centrata.
- Simbolo: fili e vetri nella parte stretta, filo della faccia larga lungo la parte larga. Nello script la
  larghezza del vano si scrive «luce / parte larga» (es. 1.00 / 1.50). Prova `incassata`.

## 10 novembre 2026 — cambio di spessore di un muro

- Correzione: scegliendo «Altro spessore» nel pannello del muro, il muro poteva saltare da solo sull'incrocio di un
  altro muro (anche lontano) e restarci incollato; potevano rovinarsi anche gli incroci dei perimetrali. Succedeva
  perché la casella dello spessore partiva vuota e per un attimo il muro non aveva spessore.
- Ora la casella parte con lo spessore che il muro aveva (0,10 per un tramezzo, 0,30 per un perimetrale) e finché
  non c'è un numero valido il muro vale come tramezzo.
- Gli incroci doppi a pochi cm si uniscono solo quando li disegni. Se dopo rendi un muro più spesso, gli incroci
  restano dove sono: decidi tu con le misure. Prova `spessore`.

## 10 novembre 2026 — muri dritti allineati

- Un tramezzo dritto diviso da un incrocio (per esempio quello che prosegue lo spigolo del perimetrale e attraversa
  un altro tramezzo) ora ha tutti i tratti nella stessa posizione: prima il tratto attaccato al perimetrale andava
  a filo con la sua faccia e quello oltre l'incrocio restava centrato, con uno scalino di 10 cm.
- «Posizione» nel pannello del muro (Centrato / A filo a sinistra / A filo a destra) ora vale per tutto il muro
  dritto, non solo per il tratto toccato.
- Attesi aggiornati: `balc`, `balc2` (cambia solo il testo dell'avviso), `ext2`, `ext3` (il tramezzo che prosegue
  il parapetto oltre l'incrocio ora è allineato al parapetto, quindi cambiano le parziali di quel lato). Prova `linea`.

## 10 novembre 2026 — incroci doppi

- Correzione: quando un tramezzo a L girava accanto allo spigolo del perimetrale (a 5–15 cm), nascevano due
  incroci vicini invece di uno: il lato della stanza saltava il tramezzo. Ora due incroci dentro lo spessore dei muri
  diventano uno solo (si sposta quello dei muri più sottili). Vale anche per due tramezzi sfalsati di pochi cm
  sopra e sotto un altro tramezzo; da 15 cm in su restano due incroci separati.
- Correzione: il «muro a filo con lo spigolo» non parte più da uno spigolo che non ha muro dietro (prima poteva
  nascere un pezzetto di 5 cm e un muro sovrapposto a un altro).
- I rilievi già fatti si sistemano da soli all'apertura; le misure scritte restano. Prova `nodi`.

## 9 novembre 2026 — tramezzi che partono da un incrocio

- Correzione: un tramezzo che parte (o finisce) vicino a un incrocio di muri, per esempio dallo spigolo dove il
  perimetrale gira e prosegue un tramezzo, ora si attacca sempre al nodo dell'incrocio. Prima poteva restare
  «a filo con lo spigolo» con l'estremità libera a pochi cm: il lato della stanza accanto saltava il tramezzo e
  arrivava a quello dopo, e la misura lungo il tramezzo partiva 10 cm dentro il muro (es. 4,00 sopra e 3,90 sotto).
- Il «muro a filo con lo spigolo» resta solo fuori dall'edificio (parapetti, muretti che proseguono la facciata).
- Anche un tramezzo che si ferma pochi cm prima di un incrocio (fino a 20 cm dalla faccia) si attacca al nodo.
- I rilievi già fatti con questo difetto si sistemano da soli all'apertura; le misure già scritte restano.
  Prova `incrocio`.

## 9 novembre 2026 — linee dritte a mano

- Note a mano: finisci la linea e **tieni ferma la penna mezzo secondo**: la linea diventa dritta (piccola
  vibrazione). Si aggancia a orizzontale, verticale e ai multipli di 15° (45°, 30°, 60°…) se ci sei vicino
  entro 6°; tenendo premuto puoi ancora spostare la fine. Gli estremi si agganciano agli spigoli dei muri
  (l'inizio anche alle facce). La scrittura resta a mano: un tratto più corto di 30 px o troppo curvo non si
  raddrizza. Prova `orto`.

## 9 novembre 2026 — nuova grafica delle misure

- Correzione: dove un tramezzo si attacca a un perimetrale la linea del perimetrale resta chiusa (anche nello
  script: i contorni dei perimetrali sono polilinee chiuse, il tramezzo si ferma sulla faccia). Attesi di `shot35`
  aggiornati (cambia solo la lunghezza dello script).

- Correzione: la casella della larghezza di una porta che cade dentro lo spicchio dell'anta ora si tocca
  (prima vinceva la selezione della porta). Prova `boxporta`.

- Misure in pianta come linee di quota (trattini agli estremi, numero sopra, lucchetto sulle misure prese).
  I tratti ancora da misurare sono pallini arancioni; le misure ricavate e le caselle da riempire compaiono
  toccando la stanza o il muro. Valori proposti delle larghezze nascosti (pallino) finché non tocchi la stanza.
- Nomi delle stanze piazzati prima delle quote e rimpiccioliti nelle stanze strette; numeri che non entrano
  nel tratto escono con una linea di richiamo.
- «Prossima» nella barra: misura guidata stanza per stanza, in senso orario dall'alto a sinistra; la finestra
  della misura si mette dalla parte opposta al tratto, con «Salta»; ✕ ferma la guida; il numero tra parentesi
  dice quante misure interne mancano.
- Interruttore in Impostazioni → Pianta: «Misure con la grafica classica» (vale per il dispositivo).
  Le prove p1, p2, pop, bk e scp girano con la grafica classica; mn prova quella nuova.

## 9 novembre 2026 — passaggio a Claude Code

- Il progetto passa nel repository: sorgente (`index.html`), prove automatiche (`test/`), istruzioni per
  Claude (`CLAUDE.md`) e questo registro.
- Rotazione della vista a passi di 90° con le due frecce curve in alto a destra della tavola (come il cubo di
  AutoCAD); al centro l'angolo attuale, toccandolo si torna a 0°. Le scritte restano leggibili; misure, script
  ed esportazioni non cambiano; la rotazione resta salvata nel rilievo.
- Aperture che sembravano cancellarsi dopo le misure: quelle con posizione proposta rientrano nel muro,
  quelle con distanza scritta restano visibili in rosso tratteggiato con l'avviso «esce dal muro».
- Muro a filo diviso da un muro nuovo: i due tratti restano allineati; il muro che si attacca a T parte dalla
  faccia del muro a filo, senza pezzetto che sporge dall'altra parte.

## 8 novembre 2026

- Parziali dei lati con una scala accostata («dal muro alla scala», «dalla scala al muro»).
- Menu «Note» con «A mano» (penna o dito), «Testo» e «Gomma».
