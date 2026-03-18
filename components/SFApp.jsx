"use client";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "./AuthProvider";
import AuthModal from "./AuthModal";
import AdminPanel from "./AdminPanel";

// ─── COLOURS ───────────────────────────────────────────────
const C = {
  erasmus: "#003DA5",
  erasmusMid: "#1A56B8",
  erasmusLight: "#E8F0FB",
  orange: "#F97316",
  yellow: "#EAB308",
  green: "#16A34A",
  red: "#DC2626",
  teal: "#0D9488",
  bg: "#F5F7FA",
  white: "#FFFFFF",
  border: "#E2E8F0",
  text: "#1E293B",
  muted: "#64748B",
  light: "#94A3B8",
};

// ─── DATA ───────────────────────────────────────────────────
const PARTICIPANTS = [
  { id: 1, name: "Marissa García Martín", role: "Admin. econòmica / Prof. Màrqueting", emoji: "👩‍💼", color: C.orange },
  { id: 2, name: "Mònica Regi Pell", role: "Professora d'anglès / Coord. Mobilitat FP", emoji: "👩‍🏫", color: C.teal },
  { id: 3, name: "Èrika Ramón Larios", role: "Estudiant CFGM Gestió Administrativa (àmbit jurídic)", emoji: "👩‍🎓", color: C.yellow },
  { id: 4, name: "Eric Rodriguez González", role: "Estudiant CFGS Màrqueting i Publicitat", emoji: "👨‍🎓", color: C.green },
  { id: 5, name: "Andrea Battaglia Rayo", role: "Estudiant CFGS Administració i Finances", emoji: "👩‍🎓", color: "#E11D74" },
];

const INITIAL_CONTACTS = [
  // ── SFUSD / HOST ──────────────────────────────────────────
  { id: 1, name: "Erin Deis", institution: "SFUSD – College & Career Readiness (Director)", email: "deise@sfusd.edu", phone: "+1 707-559-8225", sentDate: "2026-01-15", status: "Confirmat ✅", lastContact: "2026-02-24", notes: "Principal interlocutora SFUSD. Reunió confirmada: dimarts 14/04 a les 9:30h a 750 25th Ave, San Francisco CA 94121 (2n pis, sala de conferències). Business Pathway Competition (NFTE) divendres 17/04, 9h–15h, cerimònia de premis 14:30h. Gestiona possible visita a classe de 10è durant la setmana (pendent de confirmar). Responsable de signar el Mobility Agreement com a organització d'acollida." },
  { id: 2, name: "Nadia Talbot", institution: "Galileo Academy of Science & Technology (SFUSD)", email: "", phone: "", sentDate: "2026-01-23", status: "Redirigit ↗️", lastContact: "2026-01-23", notes: "Contact inicial a Galileo Academy. Va redirigir totes les gestions cap a Erin Deis (SFUSD central), ja que qualsevol visita a centres SFUSD s'ha de coordinar des de College & Career Readiness." },
  { id: 3, name: "NFTE Partner", institution: "NFTE – Network for Teaching Entrepreneurship", email: "", phone: "", sentDate: "2026-02-24", status: "Confirmat ✅", lastContact: "2026-02-24", notes: "Organitzadors de la Business Pathway Competition del 17/04. Estudiants participants: 11è i 12è de Galileo HS i Lincoln HS (San Francisco). Localització exacta de l'acte pendent de confirmar per Erin Deis. Cerimònia de premis prevista a les 14:30h." },
  // ── EMPRESES / ENTITATS SF ────────────────────────────────
  { id: 4, name: "Naomi Maisel", institution: "La Cocina SF – Incubadora gastronòmica", email: "naomi@lacocinasf.org", phone: "(415) 824-2729 ext. 321", sentDate: "2026-02-20", status: "En procés 🔄", lastContact: "2026-02-25", notes: "Directora de programes de La Cocina (incubadora de petits negocis liderats per dones i immigrants). Ofereix tour de 45 min. No fan job shadowing formal però sí observació de l'espai i explicació del model de negoci. Opció de dinar preparat per un cuiner en pràctiques ~$30/persona. Disponibilitat: dimarts, dimecres o dijous (NO dilluns ni divendres). Pendent confirmar dia definitiu i si s'inclou el dinar. Emetran certificat d'assistència per als arxius Erasmus+. Adreça: 101 Polk St, Civic Center, SF." },
  { id: 5, name: "CCSF Outreach", institution: "City College of San Francisco (CCSF)", email: "outreach@ccsf.edu", phone: "", sentDate: "2026-01-28", status: "Parcial 🟡", lastContact: "2026-01-28", notes: "No ofereixen job shadowing formal ni visites de classe per a grups externs. Sí ofereixen campus tour de l'edifici principal. Possibilitat de contactar amb el departament de CTE/apprenticeships a través d'Erin Deis per a una visita més específica. No prioritari si l'agenda s'omple." },
  { id: 6, name: "Lick-Wilmerding HS", institution: "Lick-Wilmerding High School (escola privada, SF)", email: "", phone: "", sentDate: "2026-01-29", status: "Pendent ⏳", lastContact: "2026-01-29", notes: "Escola privada fundada com a 'trades school' amb fort component pràctic i tècnic. Suggerida per Erin Deis com a referent de model educatiu innovador. Ofereix formació en àrees d'ofici (fusta, metal·listeria, cuina, electrònica). Pendent de resposta al correu inicial. Adreça: 755 Ocean Ave, San Francisco." },
  // ── ALLOTJAMENT / VIATGES ────────────────────────────────
  { id: 7, name: "Eduardo Temprano", institution: "Viajes Radialtours S.L. – Agent de viatges", email: "info@radialtours.com", phone: "+34 972 34 60 60", sentDate: "2026-02-02", status: "Confirmat ✅", lastContact: "2026-02-02", notes: "Agent de viatges responsable del paquet. Expedient núm. 260410. Pressupost total: 7.050€ per 5 passatgers (1.410€/persona). Inclou: vols BCN-SFO-BCN (United/Lufthansa), hotel FOUND Carlton Nob Hill (10–18 abril, 2 dobles + 1 individual), assegurança Asistencia + Cancelación Start Plus. IMPORTANT: ESTA pendent de tramitar per tots els participants abans d'emissió de bitllets." },
  { id: 8, name: "FOUND Hotel Carlton", institution: "FOUND Hotel Carlton, Nob Hill – Allotjament", email: "", phone: "+1 (415) 673-0242", sentDate: "2026-02-02", status: "Confirmat ✅", lastContact: "2026-02-02", notes: "Hotel reservat via Radialtours. Adreça: 1075 Sutter St, Nob Hill, San Francisco CA 94109. Valoració Google: 4.1/5 (1.175 ressenyes). Check-in: 10/04 · Check-out: 18/04 (8 nits). Habitacions: 2 dobles + 1 individual. IMPORTANT: esmorzar NO inclòs. Estil boutique/hostel modern. Ben comunicat amb transport públic (MUNI, linia 2 i 3)." },
  // ── EQUIP INTERN SERRALLARGA ─────────────────────────────
  { id: 9, name: "Rubén Fernández Carvajal", institution: "Institut Serrallarga – Director", email: "rferna55@xtec.cat", phone: "+34 686 163 582", sentDate: "2026-01-01", status: "Intern ✅", lastContact: "2026-02-25", notes: "Director del centre i responsable institucional del projecte Erasmus+. Signatari dels Learning Agreements (secció institució d'origen) i dels Mobility Agreements. Ha donat el vist-i-plau als 5 participants seleccionats. Cal mantenir-lo informat de qualsevol canvi en l'itinerari o en els contactes amb SFUSD." },
  { id: 10, name: "Marissa García Martín", institution: "Institut Serrallarga – Admin. econòmica / Prof. Màrqueting", email: "mgar2373@xtec.cat", phone: "+34 619 352 787", sentDate: "2026-01-01", status: "Intern ✅", lastContact: "2026-02-25", notes: "Administradora econòmica i professora de màrqueting. Coordinadora operativa del viatge: gestió de pressupost, comunicació amb Radialtours, contactes amb SFUSD i La Cocina, tramitació ESTA. Participa com a Staff Training (KA121). Europass referència: pendent." },
  { id: 11, name: "Mònica Regi Pell", institution: "Institut Serrallarga – Professora anglès / Coord. Mobilitat VET", email: "mregi@xtec.cat", phone: "+34 687 566 402", sentDate: "2026-01-01", status: "Intern ✅", lastContact: "2026-02-25", notes: "Professora d'anglès als cicles formatius i Coordinadora de Mobilitat VET. Participa com a Job Shadowing (KA121). Responsable de la comunicació en anglès amb les organitzacions d'acollida. Europass: 15071-MOB-0001. Col·labora en la preparació lingüística i cultural dels estudiants." },
  { id: 12, name: "Èrika Ramón Larios", institution: "Institut Serrallarga – Estudiant CFGM Gestió Administrativa", email: "", phone: "", sentDate: "2026-01-01", status: "Intern ✅", lastContact: "2026-02-25", notes: "Estudiant del CFGM d'Administració i Gestió. Participant KA131 (mobilitat estudiantil). Activitats previstes: observació SFUSD, visita empreses, Business Pathway Competition. Competències treballades: Literacy, Multilingual, Digital, Personal/Social, Citizenship, Entrepreneurship, Cultural Awareness. Reconeixement: 3 ECTS (embedded)." },
  { id: 13, name: "Eric Rodriguez González", institution: "Institut Serrallarga – Estudiant CFGM Màrqueting", email: "", phone: "", sentDate: "2026-01-01", status: "Intern ✅", lastContact: "2026-02-25", notes: "Estudiant del CFGM de Màrqueting i Publicitat. Participant KA131 (mobilitat estudiantil). Activitats previstes: observació SFUSD CTE Business Pathway, visita La Cocina (model de negoci), Business Pathway Competition. Interès especial en emprenedoria i models de màrqueting nord-americans." },
  { id: 14, name: "Andrea Battaglia Rayo", institution: "Institut Serrallarga – Estudiant CFGM Administració", email: "", phone: "", sentDate: "2026-01-01", status: "Intern ✅", lastContact: "2026-02-25", notes: "Estudiant del CFGM d'Administració. Participant KA131 (mobilitat estudiantil). Activitats previstes: observació SFUSD, visites empresarials, Business Pathway Competition. Competències a desenvolupar: gestió administrativa en entorn internacional, comunicació en anglès professional." },
  // ── ASSEGURANÇA / DOCUMENTACIÓ ───────────────────────────
  { id: 15, name: "Servei d'Assistència en Viatge", institution: "Assegurança Viatge – Paquet Asistencia + Cancelación Start Plus", email: "", phone: "+34 900 (inclosa al paquet Radialtours)", sentDate: "2026-02-02", status: "Confirmat ✅", lastContact: "2026-02-02", notes: "Assegurança inclosa al paquet Radialtours (Expedient 260410). Cobertures: Mèdica: 500.000€ a l'estranger / 6.000€ a Espanya. Cancel·lació: 3.500€ (44 causes cobertes). Equipatge: 1.500€. Retards: 15€/hora (màx 450€). Responsabilitat civil: 60.000€. Accidents: 10.000€ (24h) / 35.000€ (transport públic). IMPORTANT: guardar documentació de la pòlissa per a tots els participants." },
  { id: 16, name: "CBDP / Esta.cbp.dhs.gov", institution: "ESTA – Autorització Electrònica de Viatge als EUA", email: "", phone: "", sentDate: "2026-02-25", status: "Pendent ⏳", lastContact: "2026-02-25", notes: "Tots els participants han de tramitar l'ESTA abans de l'emissió de bitllets. URL oficial: https://esta.cbp.dhs.gov. IMPORTANT: Viatgers que hagin visitat Cuba després del 12/01/2021 NO poden usar ESTA i han de sol·licitar visat tradicional a l'Ambaixada dels EUA a Madrid (temps d'espera actual: diversos mesos). Cost ESTA: $21/persona. Validesa: 2 anys o fins a expiració del passaport. Participants pendents: tots 5." },
  // ── CONTACTES NOUS DELS CORREUS ──────────────────────────
  { id: 17, name: "Fernando Flores-Cardenas", institution: "Galileo Academy of Science & Technology – Sub-director", email: "flores-cardenasf@sfusd.edu", phone: "(415) 749-3430 x3238", sentDate: "2026-01-22", status: "Redirigit ↗️", lastContact: "2026-01-22", notes: "Assistant Principal a Galileo HS (SFUSD). Va rebre el nostre primer correu de sol·licitud de Job Shadowing (22/01/26) i va redirigir a Richard McDowell i Nadia Talbot (CTE coordinadors). Va cc Erin Deis. Citació: 'I will forward your email to our CTE coordinators.'" },
  { id: 18, name: "Richard McDowell", institution: "Galileo Academy of Science & Technology – CTE Coordinator (SFUSD)", email: "McDowellR@sfusd.edu", phone: "", sentDate: "2026-01-22", status: "Redirigit ↗️", lastContact: "2026-01-22", notes: "CTE Coordinator a Galileo HS (SFUSD). Posat en cc per Fernando Flores-Cardenas. Nadia Talbot el va cc en la seva resposta redirigint cap a Erin Deis. No ha respost directament." },
  { id: 19, name: "Zachary Lam", institution: "City College of San Francisco (CCSF) – Dual Enrollment", email: "zlam@ccsf.edu", phone: "", sentDate: "2026-01-29", status: "En procés 🔄", lastContact: "2026-01-29", notes: "Contacte a CCSF per a Dual Enrollment. Erin Deis el va introduir via e-mail (29/01/26): 'Copied on this email is Marissa Garcia Martin from Institut Serrallarga...' Possiblement pugui facilitar informació sobre programes de matrícula dual SFUSD↔CCSF. Pendent de seguiment." },
  { id: 20, name: "Mary Karam McKey", institution: "IIE – Institute of International Education (Nova York)", email: "MMckey@iie.org", phone: "", sentDate: "2026-01-13", status: "En procés 🔄", lastContact: "2026-02-23", notes: "Program Officer a IIE (Institute of International Education). Primera resposta positiva (21/01): 'we would welcome the opportunity to reconnect in the future, should circumstances allow.' Conversa activa fins a 23/02. Ha mostrat interès en explorar col·laboració futura. Seu: 1 E 67th St, New York, NY." },
  { id: 21, name: "Shawn Dillard", institution: "University of San Francisco (USF) – Program Director, Immersions", email: "sdillard1@usfca.edu", phone: "(415) 422-6848", sentDate: "2026-01-14", status: "En procés 🔄", lastContact: "2026-01-22", notes: "Program Director d'Immersions i Short-term Programs a USF. Va respondre (22/01) mostrant disponibilitat d'ajuda. Programa Global Immersions. Pendent de confirmar visita/reunió durant la setmana del 13–17 abril." },
  { id: 22, name: "Shelby Schoppet-Panzarini", institution: "Silicon Valley Education Foundation (SVeF) – Associate Director STEM", email: "shelby@svefoundation.org", phone: "408-790-9479", sentDate: "2026-02-24", status: "Redirigit ↗️", lastContact: "2026-03-03", notes: "Associate Director of STEM Programs a SVeF (Sobrato Center for Nonprofits, 1400 Parkmoor Ave, Suite 200, San Jose, CA 95126). Va declinar visita (27/02): 'we don't have the bandwidth to add another meeting.' Organització notable per futures col·laboracions." },
  { id: 23, name: "Jennifer Brook Beltz", institution: "Foothill + De Anza Colleges (FHDA) – Executive Director International Programs", email: "brookjennifer@fhda.edu", phone: "", sentDate: "2026-01-21", status: "Confirmat ✅", lastContact: "2026-03-13", notes: "Executive Director of International Student Programs a Foothill i De Anza Colleges (FHDA). Primera resposta positiva (27/01): disposada a explorar visita i va consultar amb col·legues. Follow-up enviat 09/03. Ha derivat a Marilyn Cheung (Directora de Recruitment) per organitzar la visita. Adreça: 12345 El Monte Road, Los Altos Hills, CA 94022. Web: http://international.fhda.edu" },
  { id: 30, name: "Marilyn Cheung", institution: "Foothill + De Anza Colleges (FHDA) – Director International Recruitment & Partner Relations", email: "cheungm@fhda.edu", phone: "+1 (650) 949-7482", sentDate: "2026-03-13", status: "Confirmat ✅", lastContact: "2026-03-13", notes: "Directora de International Student Recruitment and Partner Relations a FHDA. Va contactar (13/03) per organitzar la visita: 'I will be arranging your visit.' Ha contactat un administrador per als programes CTE i workforce development. Prepararà un programa de visita un cop rebi resposta. VISITA EN PROCÉS DE CONFIRMACIÓ per la setmana del 13–17 abril. Adreça: 12345 El Monte Road, Los Altos Hills, CA 94022." },
  { id: 24, name: "Terri Eppley", institution: "West Valley College – International Programs", email: "Terri.Eppley@westvalley.edu", phone: "", sentDate: "2026-02-22", status: "Pendent ⏳", lastContact: "2026-02-22", notes: "Contacte a West Valley College (Saratoga, CA). Va respondre amb autoreply (22/02) indicant ausència temporal. Pendent de resposta efectiva. West Valley College: 14000 Fruitvale Ave, Saratoga, CA 95070." },
  { id: 25, name: "CCSF Outreach & Recruitment", institution: "City College of San Francisco – Campus Tour", email: "outreach@ccsf.edu", phone: "", sentDate: "2026-01-20", status: "Confirmat ✅", lastContact: "2026-03-02", notes: "Campus Tour Ocean Campus CONFIRMAT via Calendly (02/03/26). Data: dimecres 15 d'abril 2026, 14:15h (PDT). Punt de trobada: Student Success Center, 50 Frida Kahlo Way, SF 94112 (cantonada Ocean Ave). Durada: 45 min – 1h15min. Arribar 5–10 min abans. Contactar per aparcament si cal." },
  { id: 26, name: "UC Berkeley Visitor Services", institution: "University of California Berkeley – Campus Walking Tour", email: "tour@berkeley.edu", phone: "510-642-5215", sentDate: "2026-03-02", status: "Confirmat ✅", lastContact: "2026-03-02", notes: "Campus Walking Tour CONFIRMAT. Data: dilluns 13 d'abril 2026, 09:30h–11:00h. Punt de trobada: Koret Visitor Center, Goldman Plaza, California Memorial Stadium (2207 Piedmont Ave, Berkeley CA 94704). Final: Sproul Plaza. Grup de 5 persones. Confirmació núm: 414071. IMPORTANT: arribar 15 min abans (09:15h). El tour surt en punt. Si cal cancel·lar o canviar nombre de persones: tour@berkeley.edu. BART: baixar a Downtown Berkeley station (25-30 min a peu fins al Visitor Center)." },
  { id: 27, name: "Spartans Abroad / SJSU", institution: "San José State University – International Programs (Spartans Abroad)", email: "spartansabroad@sjsu.edu", phone: "", sentDate: "2026-01-13", status: "En procés 🔄", lastContact: "2026-01-28", notes: "Contacte internacional de SJSU (San José State University). Va respondre (28/01) indicant disposició a explorar col·laboració: 'we would welcome the opportunity to reconnect in the future.' Conversa activa fins 28/01. Pendent de seguiment per confirmar visita o reunió." },
  { id: 28, name: "Metropolitan Education District", institution: "Silicon Valley CTE – Metropolitan Education District", email: "formsubmissions@catapultcms.com", phone: "", sentDate: "2026-02-03", status: "En procés 🔄", lastContact: "2026-03-08", notes: "Formulari de sol·licitud Job Shadowing enviat al Metropolitan Education District – Staff Directory (03/02/26). Rebut confirmació de rebuda del formulari. Seguiment el 08/03. Organitzen programes CTE (Career Technical Education) per a estudiants del Silicon Valley." },
  { id: 29, name: "Palo Alto Adult School", institution: "Palo Alto Adult School – International / CTE", email: "adultschool@pausd.org", phone: "", sentDate: "2026-03-09", status: "Pendent ⏳", lastContact: "2026-03-09", notes: "Correu de sol·licitud de Job Shadowing enviat el 09/03/26. Pendent de resposta. Palo Alto Adult School ofereix programes d'educació d'adults i formació professional a Palo Alto, CA." },
];

const FLIGHT_EVENTS = [
  { date: "2026-04-10", time: "06:40", title: "✈️ Sortida BCN Terminal 1 → Frankfurt (UA9317 op. Lufthansa)", type: "flight" },
  { date: "2026-04-10", time: "08:50", title: "🛬 Arribada Frankfurt – escala 1h35m", type: "flight" },
  { date: "2026-04-10", time: "10:25", title: "✈️ Sortida Frankfurt → SFO Terminal I (UA8829 op. Lufthansa)", type: "flight" },
  { date: "2026-04-10", time: "12:40", title: "🛬 Arribada SFO – Check-in Hotel Carlton Nob Hill", type: "arrive" },
  { date: "2026-04-14", time: "09:30", title: "🤝 Reunió Erin Deis – SFUSD, 750 25th Ave, 2n pis", type: "meeting" },
  { date: "2026-04-17", time: "09:00", title: "🏆 Business Pathway Competition – NFTE + SFUSD (Galileo & Lincoln HS)", type: "event" },
  { date: "2026-04-17", time: "14:30", title: "🎖️ Cerimònia de premis Business Pathway Competition", type: "event" },
  { date: "2026-04-18", time: "12:10", title: "✈️ Sortida SFO Terminal 3 → Chicago O'Hare (UA1394 op. United)", type: "flight" },
  { date: "2026-04-18", time: "18:43", title: "🛬 Arribada Chicago – escala 2h57m", type: "flight" },
  { date: "2026-04-18", time: "21:40", title: "✈️ Sortida Chicago → BCN Terminal 1 (UA769 op. United)", type: "flight" },
  { date: "2026-04-19", time: "13:15", title: "🏠 Arribada BCN Terminal 1", type: "arrive" },
  { date: "2026-04-13", time: "09:30", title: "🎓 Campus Walking Tour UC Berkeley – Koret Visitor Center (conf. 414071)", type: "meeting" },
  { date: "2026-04-15", time: "14:15", title: "🎓 Campus Tour CCSF Ocean Campus – Student Success Center, 50 Frida Kahlo Way", type: "meeting" },
  { date: "2026-04-16", time: "10:00", title: "🎓 Visita Foothill+De Anza Colleges (FHDA) – per confirmar amb Marilyn Cheung", type: "pending" },
  { date: "2026-04-15", time: "10:00", title: "🍴 Tour La Cocina SF (per confirmar dia)", type: "pending" },
];

const TABS = ["🏠 Inici", "📋 CRM", "📅 Calendari", "🌉 Info SF", "💰 Pressupost", "📖 Diari", "📊 Avaluació"];

const STATUS_COLORS = {
  "Confirmat ✅": { bg: "#DCFCE7", text: "#166534", border: "#BBF7D0" },
  "En procés 🔄": { bg: "#FEF9C3", text: "#854D0E", border: "#FDE68A" },
  "Pendent ⏳": { bg: "#F1F5F9", text: "#475569", border: "#CBD5E1" },
  "Parcial 🟡": { bg: "#FFF7ED", text: "#9A3412", border: "#FDBA74" },
  "Redirigit ↗️": { bg: "#EFF6FF", text: "#1E40AF", border: "#BFDBFE" },
  "Intern ✅": { bg: "#EDE9FE", text: "#4C1D95", border: "#C4B5FD" },
};

// ─── TRANSLATIONS ───────────────────────────────────────────
const T = {
  ca: {
    login: "Iniciar sessió", logout: "Sortir", register: "Sol·licitar accés",
    readOnly: "Mode lectura — contingut públic.", loginToEdit: "Inicia sessió per editar",
    pendingApproval: "Accés pendent d'aprovació",
    tabs: ["🏠 Inici", "📋 CRM", "📅 Calendari", "🌉 Info SF", "💰 Pressupost", "📖 Diari", "📊 Avaluació", "🔒 Documents"],
    public: "Públic", private: "Privat", makePublic: "Fer públic", makePrivate: "Fer privat",
    addEntry: "+ Nova entrada", edit: "Editar", delete: "Eliminar", save: "Desar", cancel: "Cancel·lar",
    filterBy: "Filtrar per", all: "Tots", allF: "Totes", person: "Persona", day: "Dia",
    addContact: "+ Afegir contacte", editContact: "Editar contacte", newContact: "Nou contacte",
    adminPanel: "👤 Admin", language: "Idioma",
    diaryTitle: "Diari col·laboratiu", crmTitle: "Gestió de Contactes (CRM)",
    calendarTitle: "Calendari del viatge", docsTitle: "Documents privats",
    visibleAll: "👁️ Visible per a tothom", visiblePrivate: "🔒 Només usuaris autoritzats",
    addDoc: "+ Afegir document", docType: "Tipus", docName: "Nom / Descripció", docPerson: "Persona",
    docTypes: ["ESTA", "Passaport", "Assegurança", "Billets", "Allotjament", "Altres"],
    notes: "Notes", addNote: "+ Afegir nota",
    addEvent: "+ Afegir esdeveniment", newEvent: "Nou esdeveniment", eventTitle: "Títol de l'esdeveniment",
    add: "Afegir", drag: "Arrossega",
    teamTitle: "El nostre equip", objectivesTitle: "Objectius del projecte",
    countdown: "Compte enrere fins l'enlairament",
    calendarPhases: ["Fase preparació", "Reunions pre-viatge", "Darrera setmana", "Viatge SF"],
    calendarViews: ["📅 Reunions pre-viatge", "🗓️ Calendari del viatge", "📌 Pissarra"],
    completed: "Completada", pending2: "Pendent",
    week1: "Setmana 1 · 6–12 abril 2026", week2: "Setmana 2 · 13–19 abril 2026",
    erasmusMeetings: "Reunions Erasmus+ setmanals — dilluns 15:00h",
    meetingLabel: "🔄 Reunió Erasmus+",
    meetingPlace: "15:00h · Institut Serrallarga · Sala de reunions",
    now: "ARA",
    publish: "Publicar",
    emptyDiary: "El diari és buit. Sigues el primer en escriure!",
    clearFilters: "✕ Netejar filtres",
    entries: (n) => `${n} entrada${n !== 1 ? "es" : ""}`,
    typeLabels: { flight: "Vol", meeting: "Reunió", event: "Activitat", arrive: "Arribada", pending: "Pendent" },
    statusLabels: { total: "Total", confirmed: "Confirmats", inProgress: "En procés", pending: "Pendents" },
    searchPlaceholder: "🔍 Cercar per nom, institució, notes...",
    scheduleTitle: "Cronograma del projecte",
    boardTitle: "📌 Pissarra col·laborativa",
    boardPlaceholder: "Escriu una nota...",
    noteTarget: "On s'afegeix la nota:",
    noteBoard: "Pissarra general",
    colorLabel: "Color:",
    infoTitle: "Informació pràctica de San Francisco",
    budgetTitle: "Control de Pressupost",
    evalTitle: "Autoavaluació Erasmus+",
  },
  es: {
    login: "Iniciar sesión", logout: "Salir", register: "Solicitar acceso",
    readOnly: "Modo lectura — contenido público.", loginToEdit: "Inicia sesión para editar",
    pendingApproval: "Acceso pendiente de aprobación",
    tabs: ["🏠 Inicio", "📋 CRM", "📅 Calendario", "🌉 Info SF", "💰 Presupuesto", "📖 Diario", "📊 Evaluación", "🔒 Documentos"],
    public: "Público", private: "Privado", makePublic: "Hacer público", makePrivate: "Hacer privado",
    addEntry: "+ Nueva entrada", edit: "Editar", delete: "Eliminar", save: "Guardar", cancel: "Cancelar",
    filterBy: "Filtrar por", all: "Todos", allF: "Todas", person: "Persona", day: "Día",
    addContact: "+ Añadir contacto", editContact: "Editar contacto", newContact: "Nuevo contacto",
    adminPanel: "👤 Admin", language: "Idioma",
    diaryTitle: "Diario colaborativo", crmTitle: "Gestión de Contactos (CRM)",
    calendarTitle: "Calendario del viaje", docsTitle: "Documentos privados",
    visibleAll: "👁️ Visible para todos", visiblePrivate: "🔒 Solo usuarios autorizados",
    addDoc: "+ Añadir documento", docType: "Tipo", docName: "Nombre / Descripción", docPerson: "Persona",
    docTypes: ["ESTA", "Pasaporte", "Seguro", "Billetes", "Alojamiento", "Otros"],
    notes: "Notas", addNote: "+ Añadir nota",
    addEvent: "+ Añadir evento", newEvent: "Nuevo evento", eventTitle: "Título del evento",
    add: "Añadir", drag: "Arrastra",
    teamTitle: "Nuestro equipo", objectivesTitle: "Objetivos del proyecto",
    countdown: "Cuenta atrás hasta el despegue",
    calendarPhases: ["Fase preparación", "Reuniones pre-viaje", "Última semana", "Viaje SF"],
    calendarViews: ["📅 Reuniones pre-viaje", "🗓️ Calendario del viaje", "📌 Pizarra"],
    completed: "Completada", pending2: "Pendiente",
    week1: "Semana 1 · 6–12 abril 2026", week2: "Semana 2 · 13–19 abril 2026",
    erasmusMeetings: "Reuniones Erasmus+ semanales — lunes 15:00h",
    meetingLabel: "🔄 Reunión Erasmus+",
    meetingPlace: "15:00h · Institut Serrallarga · Sala de reuniones",
    now: "AHORA",
    publish: "Publicar",
    emptyDiary: "El diario está vacío. ¡Sé el primero en escribir!",
    clearFilters: "✕ Limpiar filtros",
    entries: (n) => `${n} entrada${n !== 1 ? "s" : ""}`,
    typeLabels: { flight: "Vuelo", meeting: "Reunión", event: "Actividad", arrive: "Llegada", pending: "Pendiente" },
    statusLabels: { total: "Total", confirmed: "Confirmados", inProgress: "En proceso", pending: "Pendientes" },
    searchPlaceholder: "🔍 Buscar por nombre, institución, notas...",
    scheduleTitle: "Cronograma del proyecto",
    boardTitle: "📌 Pizarra colaborativa",
    boardPlaceholder: "Escribe una nota...",
    noteTarget: "¿Dónde se añade la nota?",
    noteBoard: "Pizarra general",
    colorLabel: "Color:",
    infoTitle: "Información práctica de San Francisco",
    budgetTitle: "Control de Presupuesto",
    evalTitle: "Autoevaluación Erasmus+",
  },
  en: {
    login: "Log in", logout: "Log out", register: "Request access",
    readOnly: "Read-only mode — public content.", loginToEdit: "Log in to edit",
    pendingApproval: "Access pending approval",
    tabs: ["🏠 Home", "📋 CRM", "📅 Calendar", "🌉 SF Info", "💰 Budget", "📖 Diary", "📊 Evaluation", "🔒 Documents"],
    public: "Public", private: "Private", makePublic: "Make public", makePrivate: "Make private",
    addEntry: "+ New entry", edit: "Edit", delete: "Delete", save: "Save", cancel: "Cancel",
    filterBy: "Filter by", all: "All", allF: "All", person: "Person", day: "Day",
    addContact: "+ Add contact", editContact: "Edit contact", newContact: "New contact",
    adminPanel: "👤 Admin", language: "Language",
    diaryTitle: "Collaborative diary", crmTitle: "Contact Management (CRM)",
    calendarTitle: "Trip calendar", docsTitle: "Private documents",
    visibleAll: "👁️ Visible to everyone", visiblePrivate: "🔒 Authorised users only",
    addDoc: "+ Add document", docType: "Type", docName: "Name / Description", docPerson: "Person",
    docTypes: ["ESTA", "Passport", "Insurance", "Flights", "Accommodation", "Other"],
    notes: "Notes", addNote: "+ Add note",
    addEvent: "+ Add event", newEvent: "New event", eventTitle: "Event title",
    add: "Add", drag: "Drag",
    teamTitle: "Our team", objectivesTitle: "Project objectives",
    countdown: "Countdown to departure",
    calendarPhases: ["Preparation phase", "Pre-trip meetings", "Last week", "SF Trip"],
    calendarViews: ["📅 Pre-trip meetings", "🗓️ Trip calendar", "📌 Board"],
    completed: "Completed", pending2: "Pending",
    week1: "Week 1 · 6–12 April 2026", week2: "Week 2 · 13–19 April 2026",
    erasmusMeetings: "Weekly Erasmus+ meetings — Monday 15:00h",
    meetingLabel: "🔄 Erasmus+ meeting",
    meetingPlace: "15:00h · Institut Serrallarga · Meeting room",
    now: "NOW",
    publish: "Publish",
    emptyDiary: "The diary is empty. Be the first to write!",
    clearFilters: "✕ Clear filters",
    entries: (n) => `${n} entr${n !== 1 ? "ies" : "y"}`,
    typeLabels: { flight: "Flight", meeting: "Meeting", event: "Activity", arrive: "Arrival", pending: "Pending" },
    statusLabels: { total: "Total", confirmed: "Confirmed", inProgress: "In progress", pending: "Pending" },
    searchPlaceholder: "🔍 Search by name, institution, notes...",
    scheduleTitle: "Project schedule",
    boardTitle: "📌 Collaborative board",
    boardPlaceholder: "Write a note...",
    noteTarget: "Where to add the note:",
    noteBoard: "General board",
    colorLabel: "Colour:",
    infoTitle: "Practical information – San Francisco",
    budgetTitle: "Budget tracker",
    evalTitle: "Erasmus+ self-assessment",
  },
};

// ─── UTILS ──────────────────────────────────────────────────
const fmtDate = (d) => d ? new Date(d + "T12:00:00").toLocaleDateString("ca-ES") : "—";
const getDaysUntil = (targetDate) => {
  const now = new Date();
  const target = new Date(targetDate + "T00:00:00");
  return Math.ceil((target - now) / 86400000);
};

function useClocks() {
  const [t, setT] = useState(new Date());
  useEffect(() => { const i = setInterval(() => setT(new Date()), 1000); return () => clearInterval(i); }, []);
  return t;
}

function AnalogClock({ time, tzOffset }) {
  const utc = time.getTime() + time.getTimezoneOffset() * 60000;
  const local = new Date(utc + tzOffset * 3600000);
  const h = ((local.getUTCHours() % 12) + local.getUTCMinutes() / 60) * 30;
  const m = local.getUTCMinutes() * 6;
  const s = local.getUTCSeconds() * 6;
  const pt = (a, r) => [50 + r * Math.sin((a * Math.PI) / 180), 50 - r * Math.cos((a * Math.PI) / 180)];
  return (
    <svg viewBox="0 0 100 100" width="100" height="100">
      <circle cx="50" cy="50" r="48" fill="white" stroke={C.erasmus} strokeWidth="2.5" />
      {[...Array(12)].map((_, i) => {
        const [x, y] = pt(i * 30, 42);
        return <circle key={i} cx={x} cy={y} r="2.5" fill={C.erasmus} opacity="0.4" />;
      })}
      <line x1="50" y1="50" x2={pt(h, 26)[0]} y2={pt(h, 26)[1]} stroke={C.text} strokeWidth="3.5" strokeLinecap="round" />
      <line x1="50" y1="50" x2={pt(m, 34)[0]} y2={pt(m, 34)[1]} stroke={C.text} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="50" x2={pt(s, 36)[0]} y2={pt(s, 36)[1]} stroke={C.orange} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="50" cy="50" r="3" fill={C.erasmus} />
    </svg>
  );
}

function Countdown() {
  const [left, setLeft] = useState({});
  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const target = new Date("2026-04-10T06:40:00");
      const diff = target - now;
      if (diff <= 0) { setLeft({ done: true }); return; }
      setLeft({ d: Math.floor(diff / 86400000), h: Math.floor((diff % 86400000) / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) });
    };
    calc();
    const i = setInterval(calc, 1000);
    return () => clearInterval(i);
  }, []);
  if (left.done) return <div style={{ color: C.green, fontWeight: 700, fontSize: 20 }}>✈️ Bon viatge!</div>;
  return (
    <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
      {[["dies", left.d], ["hores", left.h], ["minuts", left.m], ["seg", left.s]].map(([l, v]) => (
        <div key={l} style={{ textAlign: "center", background: C.erasmus, borderRadius: 12, padding: "16px 20px", minWidth: 70 }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: "white", fontFamily: "monospace" }}>{String(v).padStart(2, "0")}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: 1 }}>{l}</div>
        </div>
      ))}
    </div>
  );
}

// ─── LOGOS (SVG inline) ─────────────────────────────────────
const ErasmusLogo = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
    <div style={{ width: 32, height: 32, background: C.erasmus, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ color: "white", fontSize: 18, fontWeight: 900, fontFamily: "serif" }}>E+</span>
    </div>
    <span style={{ color: "white", fontWeight: 700, fontSize: 13 }}>Erasmus+</span>
  </div>
);

const SerrallargaLogo = () => (
  <a href="https://agora.xtec.cat/iesserrallarga/" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 6, textDecoration: "none" }}>
    <div style={{ width: 32, height: 32, background: "rgba(255,255,255,0.2)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.4)" }}>
      <span style={{ color: "white", fontSize: 10, fontWeight: 900 }}>INS</span>
    </div>
    <span style={{ color: "white", fontWeight: 600, fontSize: 12 }}>Institut Serrallarga</span>
  </a>
);

const DeptLogo = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
    <div style={{ width: 32, height: 32, background: "rgba(255,255,255,0.2)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.4)" }}>
      <span style={{ color: "white", fontSize: 8, fontWeight: 900, textAlign: "center", lineHeight: 1.2 }}>DEPT<br/>EDU</span>
    </div>
    <span style={{ color: "white", fontWeight: 600, fontSize: 12 }}>Dept. d'Educació i FP</span>
  </div>
);

// ─── MAIN APP ────────────────────────────────────────────────
export default function App() {
  const { user, profile, canWrite, isAdmin, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [lang, setLang] = useState("ca");
  const [contacts, setContacts] = useState(INITIAL_CONTACTS);
  const [expenses, setExpenses] = useState([]);
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [boardNotes, setBoardNotes] = useState([]);
  const [docs, setDocs] = useState([]);
  const [calEvents, setCalEvents] = useState(FLIGHT_EVENTS.map((e, i) => ({ ...e, id: i, isPublic: true })));
  const [sfNotes, setSfNotes] = useState([]);
  const PREV_DEFAULT = [
    { id: 1, label: "ESTA (autorització EUA)", amount: 21, persons: PARTICIPANTS.map(p => p.name) },
    { id: 2, label: "Vols + Allotjament (Radialtours)", amount: 1410, persons: PARTICIPANTS.map(p => p.name) },
    { id: 3, label: "Transfers aeroport", amount: 0, persons: PARTICIPANTS.map(p => p.name) },
    { id: 4, label: "Altres despeses prèvies", amount: 0, persons: PARTICIPANTS.map(p => p.name) },
  ];
  const [prevExpenses, setPrevExpenses] = useState(PREV_DEFAULT);
  const [showAuth, setShowAuth] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const t = T[lang];

  useEffect(() => {
    const load = async () => {
      try {
        const r1 = await window.storage.get("sf2-contacts", true); if (r1) setContacts(JSON.parse(r1.value));
        const r2 = await window.storage.get("sf2-expenses", true); if (r2) setExpenses(JSON.parse(r2.value));
        const r3 = await window.storage.get("sf2-diary", true); if (r3) setDiaryEntries(JSON.parse(r3.value));
        const r4 = await window.storage.get("sf2-board", true); if (r4) setBoardNotes(JSON.parse(r4.value));
        const r5 = await window.storage.get("sf2-docs", true); if (r5) setDocs(JSON.parse(r5.value));
        const r6 = await window.storage.get("sf2-calevents", true); if (r6) setCalEvents(JSON.parse(r6.value));
        const r7 = await window.storage.get("sf2-sfnotes", true); if (r7) setSfNotes(JSON.parse(r7.value));
        const r8 = await window.storage.get("sf2-prevexp", true); if (r8) setPrevExpenses(JSON.parse(r8.value));
      } catch (e) {}
    };
    load();
  }, []);

  const save = (key, setter) => async (data) => {
    setter(data);
    if (!canWrite) return;
    try { await window.storage.set(key, JSON.stringify(data), true); } catch (e) {}
  };

  // Tabs: show Documents tab only to authorised users
  const visibleTabs = t.tabs.filter((_, i) => i !== 7 || canWrite);

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: C.bg, minHeight: "100vh", color: C.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=DM+Serif+Display&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-thumb { background: ${C.erasmus}44; border-radius: 3px; }
        body { font-family: 'DM Sans', sans-serif; }
        .card { background: white; border: 1px solid ${C.border}; border-radius: 12px; padding: 20px; }
        .card-sm { background: white; border: 1px solid ${C.border}; border-radius: 10px; padding: 14px; }
        .btn { background: ${C.erasmus}; color: white; border: none; border-radius: 8px; padding: 8px 18px; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.15s; font-family: 'DM Sans', sans-serif; }
        .btn:hover { background: ${C.erasmusMid}; transform: translateY(-1px); box-shadow: 0 4px 12px ${C.erasmus}33; }
        .btn-sm { padding: 5px 12px; font-size: 12px; }
        .btn-ghost { background: transparent; color: ${C.erasmus}; border: 1.5px solid ${C.erasmus}; }
        .btn-ghost:hover { background: ${C.erasmusLight}; transform: none; box-shadow: none; }
        .btn-red { background: ${C.red}; }
        .btn-red:hover { background: #b91c1c; }
        .input { background: white; border: 1.5px solid ${C.border}; border-radius: 8px; padding: 8px 12px; color: ${C.text}; font-size: 13px; font-family: 'DM Sans', sans-serif; width: 100%; transition: border 0.15s; }
        .input:focus { outline: none; border-color: ${C.erasmus}; box-shadow: 0 0 0 3px ${C.erasmusLight}; }
        .select { background: white; border: 1.5px solid ${C.border}; border-radius: 8px; padding: 8px 12px; color: ${C.text}; font-size: 13px; font-family: 'DM Sans', sans-serif; cursor: pointer; }
        .select:focus { outline: none; border-color: ${C.erasmus}; }
        .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; border: 1px solid; }
        .tab-btn { background: none; border: none; cursor: pointer; padding: 10px 18px; font-size: 13px; font-weight: 500; border-bottom: 2.5px solid transparent; transition: all 0.15s; white-space: nowrap; font-family: 'DM Sans', sans-serif; color: rgba(255,255,255,0.7); }
        .tab-btn:hover { color: white; }
        .tab-btn.active { color: white; border-bottom-color: white; font-weight: 700; }
        .section-title { font-family: 'DM Serif Display', serif; font-size: 24px; color: ${C.erasmus}; margin-bottom: 16px; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
        .grid-5 { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; }
        @media (max-width: 900px) { .grid-2, .grid-3, .grid-5 { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 600px) { .grid-2, .grid-3, .grid-5 { grid-template-columns: 1fr; } }
        textarea { background: white; border: 1.5px solid ${C.border}; border-radius: 8px; padding: 8px 12px; color: ${C.text}; font-size: 13px; font-family: 'DM Sans', sans-serif; resize: vertical; }
        textarea:focus { outline: none; border-color: ${C.erasmus}; }
        hr { border: none; border-top: 1px solid ${C.border}; margin: 14px 0; }
        .shadow { box-shadow: 0 2px 12px rgba(0,61,165,0.08); }
        .hover-lift { transition: transform 0.15s, box-shadow 0.15s; cursor: pointer; }
        .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,61,165,0.12); }
      `}</style>

      {/* Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 16px rgba(0,61,165,0.3)", background: `linear-gradient(135deg, ${C.erasmus} 0%, ${C.erasmusMid} 100%)` }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 20px" }}>
          {/* Fila 1: logos esquerra · usuari dreta */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0 0", flexWrap: "wrap", gap: 10 }}>
            <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
              <ErasmusLogo />
              <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.3)" }} />
              <SerrallargaLogo />
              <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.3)" }} />
              {/* Language selector */}
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>🌐 {t.language}</span>
                <div style={{ display: "flex", gap: 4 }}>
                  {["ca", "es", "en"].map(l => (
                    <button key={l} onClick={() => setLang(l)} style={{ background: lang === l ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.15)", color: lang === l ? C.erasmus : "white", border: "none", borderRadius: 5, padding: "3px 9px", cursor: "pointer", fontSize: 11, fontWeight: 700, fontFamily: "DM Sans, sans-serif", transition: "all 0.15s" }}>
                      {l.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {/* Auth - person icon */}
              {user ? (
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginLeft: 8 }}>
                  {canWrite && (
                    <button onClick={() => setShowAdmin(true)} style={{ background: "#7C3AED", color: "white", border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: "DM Sans, sans-serif" }}>{t.adminPanel}</button>
                  )}
                  <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 8, padding: "6px 12px", color: "white", fontSize: 12 }}>
                    {canWrite ? "✅" : "⏳"} {profile?.name || user.email?.split("@")[0]}
                  </div>
                  <button onClick={signOut} style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "white", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 12, fontFamily: "DM Sans, sans-serif" }}>{t.logout}</button>
                </div>
              ) : (
                <button onClick={() => setShowAuth(true)} title={t.login} style={{ background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.4)", color: "white", borderRadius: "50%", width: 38, height: 38, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", marginLeft: 8, flexShrink: 0 }}>👤</button>
              )}
            </div>
          </div>
          {/* Fila 2: KA121/títol centrats */}
          <div style={{ textAlign: "center", padding: "5px 0 8px" }}>
            <div style={{ color: "rgba(255,255,255,0.82)", fontSize: 11, letterSpacing: 0.3, textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
              KA121 · 2025-1-ES01-KA121-VET-000315070 &nbsp;|&nbsp; KA131 · 2025-1-ES01-KA131-HED-000315070
            </div>
            <div style={{ color: "white", fontWeight: 800, fontSize: 15, marginTop: 2, textShadow: "0 2px 6px rgba(0,0,0,0.5)" }}>
              Mobilitat San Francisco 25-26 &nbsp;·&nbsp; 10–19 abril 2026
            </div>
          </div>
          {/* Pestanyes */}
          <div style={{ display: "flex", gap: 0, overflowX: "auto", marginTop: 0 }}>
            {visibleTabs.map((tabLabel, i) => (
              <button key={i} className={`tab-btn ${activeTab === i ? "active" : ""}`} onClick={() => setActiveTab(i)}>{tabLabel}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Read-only banner */}
      {!canWrite && (
        <div style={{ background: "#FFFBEB", borderBottom: "1px solid #FDE68A", padding: "8px 20px", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontSize: 13, color: "#92400E" }}>
          <span>👁️ {t.readOnly}</span>
          <button onClick={() => setShowAuth(true)} style={{ background: "none", border: "none", color: C.erasmus, cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "DM Sans, sans-serif", textDecoration: "underline" }}>
            {user ? t.pendingApproval : t.loginToEdit}
          </button>
        </div>
      )}

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "28px 20px" }}>
        {activeTab === 0 && <HomeTab t={t} canWrite={canWrite} />}
        {activeTab === 1 && canWrite && <CRMTab contacts={contacts} setContacts={save("sf2-contacts", setContacts)} canWrite={canWrite} t={t} />}
        {activeTab === 1 && !canWrite && (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🔒</div>
            <div style={{ fontFamily: "DM Serif Display", fontSize: 24, color: C.erasmus, marginBottom: 10 }}>Contingut privat</div>
            <div style={{ fontSize: 14, color: C.muted, marginBottom: 24 }}>El CRM de contactes és accessible només per als usuaris autoritzats.</div>
            <button onClick={() => setShowAuth(true)} className="btn">Iniciar sessió</button>
          </div>
        )}
        {activeTab === 2 && <CalendarTab boardNotes={boardNotes} setBoard={save("sf2-board", setBoardNotes)} calEvents={calEvents} setCalEvents={save("sf2-calevents", setCalEvents)} canWrite={canWrite} t={t} />}
        {activeTab === 3 && <SFInfoTab canWrite={canWrite} t={t} sfNotes={sfNotes} setSfNotes={save("sf2-sfnotes", setSfNotes)} />}
        {activeTab === 4 && <BudgetTab expenses={expenses} setExpenses={save("sf2-expenses", setExpenses)} prevExpenses={prevExpenses} setPrevExpenses={save("sf2-prevexp", setPrevExpenses)} canWrite={canWrite} />}
        {activeTab === 5 && <DiaryTab entries={diaryEntries} setEntries={save("sf2-diary", setDiaryEntries)} canWrite={canWrite} t={t} />}
        {activeTab === 6 && <EvalTab canWrite={canWrite} />}
        {activeTab === 7 && canWrite && <DocsTab docs={docs} setDocs={save("sf2-docs", setDocs)} t={t} />}
      </div>

      {/* Footer */}
      <footer style={{ background: "#004494", marginTop: 40, padding: "0 28px", height: 56, display: "flex", alignItems: "center", justifyContent: "center", gap: 0 }}>
        {/* Erasmus+ */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <div style={{ width: 44, height: 29, background: "#004494", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="38" height="25" viewBox="0 0 38 25"><rect width="38" height="25" fill="#004494" rx="2"/><g fill="#FFED00"><circle cx="19" cy="4.5" r="1.4"/><circle cx="24.5" cy="6" r="1.4"/><circle cx="27.5" cy="10.5" r="1.4"/><circle cx="26" cy="16" r="1.4"/><circle cx="22" cy="19.5" r="1.4"/><circle cx="16" cy="19.5" r="1.4"/><circle cx="12" cy="16" r="1.4"/><circle cx="10.5" cy="10.5" r="1.4"/><circle cx="13.5" cy="6" r="1.4"/></g></svg>
          </div>
          <div>
            <div style={{ color: "white", fontWeight: 800, fontSize: 13, lineHeight: 1.1 }}>Erasmus+</div>
            <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 8, letterSpacing: "0.8px" }}>PROGRAMME</div>
          </div>
        </div>

        <div style={{ width: 1, height: 34, background: "rgba(255,255,255,0.3)", margin: "0 24px", flexShrink: 0 }} />

        {/* Eslògan */}
        <div style={{ flexShrink: 0 }}>
          <div style={{ color: "white", fontWeight: 700, fontSize: 13 }}>Enriching lives, opening minds.</div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 10, fontStyle: "italic", marginTop: 2 }}>Co-funded by the European Union</div>
        </div>

        <div style={{ width: 1, height: 34, background: "rgba(255,255,255,0.3)", margin: "0 24px", flexShrink: 0 }} />

        {/* Generalitat text */}
        <a href="https://agora.xtec.cat/iesserrallarga/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", flexShrink: 0, lineHeight: 1.4 }}>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 8, letterSpacing: "0.3px", textTransform: "uppercase" }}>Generalitat de Catalunya</div>
          <div style={{ color: "white", fontSize: 11, fontWeight: 700 }}>Departament d'Educació i Formació Professional</div>
          <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 10, fontWeight: 600 }}>Institut Serrallarga</div>
        </a>
      </footer>
    </div>
  );
}

// ─── TIMEZONE UTILS ─────────────────────────────────────────
// Europe/Madrid: UTC+1 (CET) → UTC+2 (CEST) last Sunday of March
// US/Pacific: UTC-8 (PST) → UTC-7 (PDT) second Sunday of March
function getEuropeMadridOffset(date) {
  // CEST starts last Sunday of March at 02:00 local, ends last Sunday of October
  const year = date.getUTCFullYear();
  // Last Sunday of March
  const mar31 = new Date(Date.UTC(year, 2, 31));
  const dstStart = new Date(Date.UTC(year, 2, 31 - mar31.getUTCDay())); // last Sun Mar
  // Last Sunday of October
  const oct31 = new Date(Date.UTC(year, 9, 31));
  const dstEnd = new Date(Date.UTC(year, 9, 31 - oct31.getUTCDay())); // last Sun Oct
  // During CEST window → UTC+2, otherwise CET → UTC+1
  return (date >= dstStart && date < dstEnd) ? 2 : 1;
}

function getUSPacificOffset(date) {
  const year = date.getUTCFullYear();
  // Second Sunday of March
  const mar1 = new Date(Date.UTC(year, 2, 1));
  const firstSunMar = (7 - mar1.getUTCDay()) % 7;
  const dstStart = new Date(Date.UTC(year, 2, 1 + firstSunMar + 7)); // 2nd Sun Mar
  // First Sunday of November
  const nov1 = new Date(Date.UTC(year, 10, 1));
  const firstSunNov = (7 - nov1.getUTCDay()) % 7;
  const dstEnd = new Date(Date.UTC(year, 10, 1 + firstSunNov)); // 1st Sun Nov
  // During PDT window → UTC-7, otherwise PST → UTC-8
  return (date >= dstStart && date < dstEnd) ? -7 : -8;
}

// ─── HOME ────────────────────────────────────────────────────
function HomeTab({ t, canWrite }) {
  const time = useClocks();
  const blanesOff = getEuropeMadridOffset(time);
  const sfOff = getUSPacificOffset(time);
  const getCity = (off) => {
    const utc = time.getTime() + time.getTimezoneOffset() * 60000;
    return new Date(utc + off * 3600000);
  };
  const fmt = (d) => d.toLocaleTimeString("ca-ES", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const blanesLabel = blanesOff === 2 ? "🇪🇸 Blanes (CEST)" : "🇪🇸 Blanes (CET)";

  // Comptador de visites
  const [visits, setVisits] = useState(null);
  useEffect(() => {
    const track = async () => {
      try {
        const r = await window.storage.get("sf2-visits", true);
        const count = r ? parseInt(r.value) + 1 : 1;
        await window.storage.set("sf2-visits", String(count), true);
        setVisits(count);
      } catch(e) {}
    };
    track();
  }, []);
  const sfLabel = sfOff === -7 ? "🇺🇸 San Francisco (PDT)" : "🇺🇸 San Francisco (PST)";

  return (
    <div>
      {/* Banner Golden Gate */}
      <div style={{ width: "100%", height: 200, backgroundImage: "url('/GoldenGateBridge-001.jpg')", backgroundSize: "cover", backgroundPosition: "center 45%", borderRadius: 12, marginBottom: 24, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }} />
      {/* Top row: countdown + clocks */}
      <div className="grid-2" style={{ marginBottom: 24, gap: 20 }}>
        {/* Countdown */}
        <div className="card shadow" style={{ borderTop: `4px solid ${C.erasmus}`, padding: "28px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: C.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{t.countdown}</div>
            <div style={{ fontFamily: "DM Serif Display", fontSize: 28, color: C.erasmus }}>✈️ Barcelona → San Francisco</div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>Divendres 10 d'abril 2026 · 06:40h · BCN Terminal 1</div>
          </div>
          <Countdown />
        </div>

        {/* Clocks */}
        <div className="card shadow" style={{ borderTop: `4px solid ${C.teal}` }}>
          <div style={{ display: "flex", gap: 24, justifyContent: "center", alignItems: "center", height: "100%", flexWrap: "wrap", padding: "8px 0" }}>
            {[{ city: blanesLabel, t: getCity(blanesOff), off: blanesOff }, { city: sfLabel, t: getCity(sfOff), off: sfOff }].map((c) => (
              <div key={c.city} style={{ textAlign: "center", padding: "0 16px" }}>
                <AnalogClock time={time} tzOffset={c.off - (-time.getTimezoneOffset() / 60)} />
                <div style={{ fontFamily: "monospace", fontSize: 24, fontWeight: 700, color: C.erasmus, marginTop: 8 }}>{fmt(c.t)}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{c.city}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Participants */}
      <div className="section-title">{t.teamTitle}</div>
      <div className="grid-5" style={{ marginBottom: 28 }}>
        {PARTICIPANTS.map(p => (
          <div key={p.id} className="card shadow hover-lift" style={{ textAlign: "center", padding: "22px 12px", borderTop: `4px solid ${p.color}` }}>
            <div style={{ fontSize: 44, marginBottom: 10 }}>{p.emoji}</div>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4, color: C.text }}>{p.name}</div>
            <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.5 }}>{p.role}</div>
          </div>
        ))}
      </div>

      {/* Objectives */}
      <div className="section-title">{t.objectivesTitle}</div>
      <div className="grid-2">
        {[
          { icon: "🎓", title: "Anàlisi del sistema CTE", text: "Analitzar com s'organitzen els pathways de Career Technical Education a nivell de districte dins el SFUSD, observant governança, currículum i avaluació." },
          { icon: "🤝", title: "Models de col·laboració", text: "Explorar models de col·laboració entre institucions educatives i empreses, comparant el sistema americà i l'espanyol per identificar sinèrgies." },
          { icon: "💡", title: "Pràctiques transferibles", text: "Identificar pràctiques innovadores per enfortir la internacionalització i la coordinació de mobilitats a l'Institut Serrallarga." },
          { icon: "🌐", title: "Diversificació internacional", text: "Ampliar les aliances internacionals més enllà del marc Erasmus+, establint connexions transatlàntiques sostenibles." },
        ].map((o) => (
          <div key={o.title} className="card shadow" style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{ fontSize: 32, flexShrink: 0, marginTop: 2 }}>{o.icon}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6, color: C.erasmus }}>{o.title}</div>
              <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.65 }}>{o.text}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Comptador de visites — només per a usuaris autoritzats */}
      {canWrite && visits !== null && (
        <div style={{ marginTop: 32, padding: "10px 20px", background: C.erasmusLight, border: `1px solid ${C.erasmus}22`, borderRadius: 10, display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: C.muted }}>
          <span style={{ fontSize: 18 }}>👁️</span>
          <span>Visites a la web: <strong style={{ color: C.erasmus, fontSize: 16 }}>{visits.toLocaleString()}</strong></span>
          <span style={{ fontSize: 11, marginLeft: 4 }}>(acumulat des del primer accés)</span>
        </div>
      )}
    </div>
  );
}

// ─── CRM ─────────────────────────────────────────────────────
function CRMTab({ contacts, setContacts, canWrite, t }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tots");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [dragCardId, setDragCardId] = useState(null);
  const [dragOverCardId, setDragOverCardId] = useState(null);
  const [form, setForm] = useState({ name: "", institution: "", email: "", phone: "", sentDate: "", status: "Pendent ⏳", lastContact: "", notes: "" });

  const statuses = ["Tots", ...Object.keys(STATUS_COLORS)];
  const filtered = contacts.filter(c =>
    (statusFilter === "Tots" || c.status === statusFilter) &&
    [c.name, c.institution, c.email, c.notes].some(f => f?.toLowerCase().includes(search.toLowerCase()))
  );

  const openEdit = (c) => { setForm(c); setEditId(c.id); setShowForm(true); setSelectedCard(null); };
  const del = (id) => { setContacts(contacts.filter(c => c.id !== id)); if (selectedCard?.id === id) setSelectedCard(null); };
  const save = () => {
    if (editId) setContacts(contacts.map(c => c.id === editId ? { ...form, id: editId } : c));
    else setContacts([...contacts, { ...form, id: Date.now() }]);
    setShowForm(false); setEditId(null);
    setForm({ name: "", institution: "", email: "", phone: "", sentDate: "", status: "Pendent ⏳", lastContact: "", notes: "" });
  };

  // Drag to reorder
  const handleCardDragStart = (e, id) => { if (!canWrite) return; setDragCardId(id); e.dataTransfer.effectAllowed = "move"; };
  const handleCardDragOver = (e, id) => { e.preventDefault(); if (id !== dragCardId) setDragOverCardId(id); };
  const handleCardDrop = (e, targetId) => {
    e.preventDefault();
    if (!dragCardId || dragCardId === targetId) { setDragCardId(null); setDragOverCardId(null); return; }
    const from = contacts.findIndex(c => c.id === dragCardId);
    const to = contacts.findIndex(c => c.id === targetId);
    if (from === -1 || to === -1) return;
    const reordered = [...contacts];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    setContacts(reordered);
    setDragCardId(null);
    setDragOverCardId(null);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div className="section-title" style={{ marginBottom: 0 }}>Gestió de Contactes (CRM)</div>
        {canWrite && <button className="btn" onClick={() => { setShowForm(true); setEditId(null); setForm({ name: "", institution: "", email: "", phone: "", sentDate: "", status: "Pendent ⏳", lastContact: "", notes: "" }); }}>+ Afegir contacte</button>}
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        {[[t.statusLabels.total, contacts.length, C.erasmus], [t.statusLabels.confirmed, contacts.filter(c => c.status.includes("Confirmat")).length, C.green], [t.statusLabels.inProgress, contacts.filter(c => c.status.includes("procés") || c.status.includes("proceso") || c.status.includes("progress")).length, C.yellow], [t.statusLabels.pending, contacts.filter(c => c.status.includes("Pendent") || c.status.includes("Pendiente") || c.status.includes("Pending")).length, C.muted]].map(([l, v, col]) => (
          <div key={l} className="card-sm" style={{ borderLeft: `4px solid ${col}`, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: col }}>{v}</div>
            <div style={{ fontSize: 12, color: C.muted }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <input className="input" style={{ maxWidth: 280 }} placeholder={t.searchPlaceholder} value={search} onChange={e => { setSearch(e.target.value); setSelectedCard(null); }} />
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {statuses.map(s => {
            const sc = STATUS_COLORS[s];
            return (
              <button key={s} onClick={() => setStatusFilter(s)} style={{ padding: "5px 14px", borderRadius: 20, border: `1.5px solid ${statusFilter === s ? C.erasmus : C.border}`, background: statusFilter === s ? C.erasmusLight : "white", color: statusFilter === s ? C.erasmus : C.muted, cursor: "pointer", fontSize: 12, fontFamily: "DM Sans, sans-serif", fontWeight: statusFilter === s ? 700 : 400 }}>{s}</button>
            );
          })}
        </div>
      </div>

      {/* Card grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14, marginBottom: 20 }}>
        {filtered.map(c => {
          const sc = STATUS_COLORS[c.status] || { bg: "#F1F5F9", text: "#475569", border: "#CBD5E1" };
          const isSelected = selectedCard?.id === c.id;
          const isDragging = dragCardId === c.id;
          const isOver = dragOverCardId === c.id;
          return (
            <div key={c.id}
              className="card hover-lift"
              draggable={canWrite}
              onDragStart={e => handleCardDragStart(e, c.id)}
              onDragOver={e => handleCardDragOver(e, c.id)}
              onDrop={e => handleCardDrop(e, c.id)}
              onDragEnd={() => { setDragCardId(null); setDragOverCardId(null); }}
              onClick={() => setSelectedCard(isSelected ? null : c)}
              style={{
                cursor: canWrite ? "grab" : "pointer",
                border: `1.5px solid ${isOver ? C.orange : isSelected ? C.erasmus : C.border}`,
                boxShadow: isSelected ? `0 0 0 3px ${C.erasmusLight}` : isOver ? `0 0 0 3px ${C.orange}33` : undefined,
                padding: 16,
                opacity: isDragging ? 0.4 : 1,
                transition: "opacity 0.15s, border-color 0.15s",
              }}>
              {canWrite && <div style={{ fontSize: 10, color: C.light, marginBottom: 4, letterSpacing: 0.5 }}>⠿ arrossega per ordenar</div>}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{c.name}</div>
                <span className="badge" style={{ background: sc.bg, color: sc.text, borderColor: sc.border, fontSize: 10, flexShrink: 0, marginLeft: 8 }}>{c.status}</span>
              </div>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>🏢 {c.institution}</div>
              {canWrite && c.email && <div style={{ fontSize: 12, color: C.erasmus }}>{c.email}</div>}
              {canWrite && c.phone && <div style={{ fontSize: 12, color: C.muted }}>{c.phone}</div>}
              {!canWrite && <div style={{ fontSize: 11, color: C.light, fontStyle: "italic" }}>🔒 Dades de contacte privades</div>}
              <div style={{ display: "flex", gap: 16, marginTop: 10, fontSize: 11, color: C.light }}>
                {c.sentDate && <span>📤 {fmtDate(c.sentDate)}</span>}
                {c.lastContact && <span>💬 {fmtDate(c.lastContact)}</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail card */}
      {selectedCard && (
        <div className="card" style={{ border: `2px solid ${C.erasmus}`, marginBottom: 20, position: "relative" }}>
          <button onClick={() => setSelectedCard(null)} style={{ position: "absolute", top: 12, right: 12, background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 18 }}>✕</button>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 20 }}>
            <div style={{ width: 60, height: 60, borderRadius: 12, background: C.erasmusLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, border: `2px solid ${C.erasmus}22` }}>
              {selectedCard.name.charAt(0)}
            </div>
            <div>
              <div style={{ fontFamily: "DM Serif Display", fontSize: 22, color: C.erasmus }}>{selectedCard.name}</div>
              <div style={{ color: C.muted, fontSize: 13 }}>{selectedCard.institution}</div>
            </div>
          </div>
          <hr />
          <div className="grid-2" style={{ marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 11, color: C.light, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Email</div>
              <div style={{ fontSize: 14, color: C.erasmus }}>{canWrite ? (selectedCard.email || "—") : "🔒 Privat"}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: C.light, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Telèfon</div>
              <div style={{ fontSize: 14 }}>{canWrite ? (selectedCard.phone || "—") : "🔒 Privat"}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: C.light, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Data d'enviament</div>
              <div style={{ fontSize: 14 }}>{fmtDate(selectedCard.sentDate)}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: C.light, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Última conversa</div>
              <div style={{ fontSize: 14 }}>{fmtDate(selectedCard.lastContact)}</div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: C.light, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Notes i historial</div>
            <div style={{ fontSize: 13, color: C.text, lineHeight: 1.7, background: C.bg, padding: "12px 16px", borderRadius: 8, border: `1px solid ${C.border}` }}>{selectedCard.notes || "—"}</div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            {canWrite && <button className="btn btn-sm btn-ghost" onClick={() => openEdit(selectedCard)}>✏️ Editar</button>}
            {canWrite && <button className="btn btn-sm btn-red" onClick={() => del(selectedCard.id)}>🗑️ Eliminar</button>}
          </div>
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div className="card" style={{ width: "100%", maxWidth: 580, maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ fontFamily: "DM Serif Display", fontSize: 20, color: C.erasmus }}>{editId ? "Editar contacte" : "Nou contacte"}</div>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 20 }}>✕</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[["Nom *", "name", "text"], ["Institució *", "institution", "text"], ["Email", "email", "email"], ["Telèfon", "phone", "text"], ["Data enviament", "sentDate", "date"], ["Última conversa", "lastContact", "date"]].map(([l, k, t]) => (
                <div key={k}>
                  <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 5, fontWeight: 600 }}>{l}</label>
                  <input className="input" type={t} value={form[k] || ""} onChange={e => setForm({ ...form, [k]: e.target.value })} />
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14 }}>
              <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 5, fontWeight: 600 }}>Estat</label>
              <select className="select" style={{ width: "100%" }} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                {Object.keys(STATUS_COLORS).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ marginTop: 14 }}>
              <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 5, fontWeight: 600 }}>Notes i historial</label>
              <textarea className="input" rows="4" style={{ width: "100%" }} value={form.notes || ""} onChange={e => setForm({ ...form, notes: e.target.value })} />
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button className="btn" onClick={save}>Desar</button>
              <button className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel·lar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CALENDAR ────────────────────────────────────────────────
function CalendarTab({ boardNotes, setBoard, calEvents, setCalEvents, canWrite, t }) {
  const [view, setView] = useState("timeline");
  const [noteText, setNoteText] = useState("");
  const [noteColor, setNoteColor] = useState("#003DA5");
  const [noteTarget, setNoteTarget] = useState("board");
  const [events, setEvents] = [calEvents, setCalEvents];
  const [dragId, setDragId] = useState(null);
  const [dragOverDate, setDragOverDate] = useState(null);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({ date: "2026-04-10", time: "09:00", title: "", type: "event", isPublic: true });
  const [editingEvent, setEditingEvent] = useState(null); // for double-click edit modal

  const typeColors = { flight: C.erasmus, meeting: C.orange, event: C.green, arrive: C.teal, pending: C.yellow };
  const typeLabels = t.typeLabels;

  const today = new Date();
  const phases = [
    { label: t.calendarPhases[0], start: "2026-02-25", end: "2026-03-09", color: C.orange },
    { label: t.calendarPhases[1], start: "2026-03-09", end: "2026-04-06", color: "#EAB308" },
    { label: t.calendarPhases[2], start: "2026-04-06", end: "2026-04-10", color: C.green },
    { label: t.calendarPhases[3], start: "2026-04-10", end: "2026-04-19", color: C.teal },
  ];

  const weeklyMeetings = ["2026-03-02", "2026-03-09", "2026-03-16", "2026-03-23", "2026-03-30", "2026-04-06"];
  const week1 = ["2026-04-06", "2026-04-07", "2026-04-08", "2026-04-09", "2026-04-10", "2026-04-11", "2026-04-12"];
  const week2 = ["2026-04-13", "2026-04-14", "2026-04-15", "2026-04-16", "2026-04-17", "2026-04-18", "2026-04-19"];

  const addNote = () => {
    if (!noteText.trim() || !canWrite) return;
    const note = { id: Date.now(), text: noteText, color: noteColor, target: noteTarget };
    setBoard([...boardNotes, note]);
    setNoteText("");
  };

  const handleDragStart = (e, evtId) => {
    setDragId(evtId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e, dateStr) => {
    e.preventDefault();
    if (dragId === null || !canWrite) return;
    setEvents(prev => prev.map(ev => ev.id === dragId ? { ...ev, date: dateStr } : ev));
    setDragId(null);
    setDragOverDate(null);
  };

  const addEvent = () => {
    if (!newEvent.title.trim() || !canWrite) return;
    setEvents(prev => [...prev, { ...newEvent, id: Date.now() }]);
    setNewEvent({ date: "2026-04-10", time: "09:00", title: "", type: "event", isPublic: true });
    setShowAddEvent(false);
  };

  const toggleEventPublic = (id) => {
    if (!canWrite) return;
    setEvents(prev => prev.map(ev => ev.id === id ? { ...ev, isPublic: !ev.isPublic } : ev));
  };

  const deleteEvent = (id) => {
    setEvents(prev => prev.filter(ev => ev.id !== id));
  };

  const saveEditingEvent = () => {
    if (!editingEvent) return;
    setEvents(prev => prev.map(ev => ev.id === editingEvent.id ? { ...editingEvent } : ev));
    setEditingEvent(null);
  };

  const EventChip = ({ ev }) => {
    const col = typeColors[ev.type] || C.erasmus;
    const isPrivate = ev.isPublic === false;
    if (!canWrite && isPrivate) return null;
    return (
      <div
        draggable={canWrite}
        onDragStart={e => canWrite && handleDragStart(e, ev.id)}
        onDragEnd={() => { setDragId(null); setDragOverDate(null); }}
        onDoubleClick={e => { e.stopPropagation(); setEditingEvent({ ...ev }); }}
        title={canWrite ? "Doble clic per editar" : ev.title}
        style={{
          fontSize: 11, background: `${col}18`, border: `1.5px solid ${col}55`,
          borderRadius: 5, padding: "4px 7px", marginBottom: 4,
          color: col, fontWeight: 600, lineHeight: 1.3, cursor: canWrite ? "grab" : "default",
          userSelect: "none", display: "flex", alignItems: "flex-start", gap: 4,
          opacity: dragId === ev.id ? 0.4 : 1,
          boxShadow: dragId === ev.id ? "none" : `0 1px 4px ${col}22`,
          transition: "opacity 0.15s, box-shadow 0.15s",
        }}
      >
        {canWrite && <span style={{ flexShrink: 0, marginTop: 1 }}>⠿</span>}
        <span style={{ flex: 1 }}><span style={{ opacity: 0.7, marginRight: 3 }}>{ev.time}</span>{ev.title.slice(0, 38)}{ev.title.length > 38 ? "…" : ""}</span>
        {canWrite && (
          <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
            {canWrite && <span onClick={(e) => { e.stopPropagation(); toggleEventPublic(ev.id); }} style={{ cursor: "pointer", fontSize: 10 }} title={isPrivate ? t.makePublic : t.makePrivate}>{isPrivate ? "🔒" : "👁️"}</span>}
            <span onClick={(e) => { e.stopPropagation(); deleteEvent(ev.id); }} style={{ cursor: "pointer", fontSize: 10, color: C.red }} title={t.delete}>✕</span>
          </div>
        )}
      </div>
    );
  };

  const DayCell = ({ dateStr, isTrip }) => {
    const dayEvents = events.filter(e => e.date === dateStr).sort((a, b) => a.time.localeCompare(b.time));
    const dayNotes = (boardNotes || []).filter(n => n.target === dateStr);
    const d = new Date(dateStr + "T12:00:00");
    const label = d.toLocaleDateString("ca-ES", { weekday: "short" }).toUpperCase();
    const num = d.getDate();
    const hasEvents = dayEvents.length > 0;
    const isOver = dragOverDate === dateStr;

    return (
      <div
        onDragOver={e => { e.preventDefault(); setDragOverDate(dateStr); }}
        onDragLeave={() => setDragOverDate(null)}
        onDrop={e => handleDrop(e, dateStr)}
        style={{
          background: isOver ? "#DBEAFE" : isTrip ? "#EFF6FF" : "white",
          border: `1.5px solid ${isOver ? C.erasmus : hasEvents ? `${C.erasmus}66` : C.border}`,
          borderRadius: 10, padding: 10, minHeight: 100,
          transition: "background 0.15s, border-color 0.15s",
          outline: isOver ? `2px dashed ${C.erasmus}` : "none",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontWeight: 800, fontSize: 20, color: hasEvents ? C.erasmus : C.muted }}>{num}</span>
          <span style={{ fontSize: 10, color: C.light, letterSpacing: 0.5 }}>{label}</span>
        </div>
        {dayEvents.map(ev => <EventChip key={ev.id} ev={ev} />)}
        {dayNotes.map(n => (
          <div key={n.id} style={{ fontSize: 11, background: `${n.color}15`, border: `1px solid ${n.color}44`, borderRadius: 5, padding: "3px 7px", marginBottom: 3, color: n.color, fontWeight: 500 }}>📌 {n.text}</div>
        ))}
      </div>
    );
  };

  return (
    <div>
      {/* Event edit modal */}
      {editingEvent && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div className="card shadow" style={{ width: "100%", maxWidth: 500, borderTop: `4px solid ${typeColors[editingEvent.type] || C.erasmus}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontWeight: 700, color: C.erasmus, fontSize: 16 }}>📋 Detall de l'esdeveniment</div>
              <button onClick={() => setEditingEvent(null)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: C.muted }}>✕</button>
            </div>
            <div style={{ marginBottom: 10, padding: "10px 14px", background: C.erasmusLight, borderRadius: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: C.erasmus, marginBottom: 4 }}>{editingEvent.title}</div>
              <div style={{ fontSize: 12, color: C.muted }}>📅 {fmtDate(editingEvent.date)} · ⏰ {editingEvent.time}h · {typeLabels[editingEvent.type]}</div>
            </div>
            {canWrite && <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                <div>
                  <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 4, fontWeight: 600 }}>Data</label>
                  <input className="input" type="date" value={editingEvent.date} onChange={e => setEditingEvent({ ...editingEvent, date: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 4, fontWeight: 600 }}>Hora</label>
                  <input className="input" type="time" value={editingEvent.time} onChange={e => setEditingEvent({ ...editingEvent, time: e.target.value })} />
                </div>
              </div>
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 4, fontWeight: 600 }}>Títol</label>
                <input className="input" value={editingEvent.title} onChange={e => setEditingEvent({ ...editingEvent, title: e.target.value })} />
              </div>
            </>}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 4, fontWeight: 600 }}>Notes</label>
              {canWrite
                ? <textarea className="input" rows="3" value={editingEvent.notes || ""} onChange={e => setEditingEvent({ ...editingEvent, notes: e.target.value })} style={{ width: "100%" }} placeholder="Afegeix informació addicional..." />
                : <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6, padding: "10px 14px", background: C.bg, borderRadius: 8 }}>{editingEvent.notes || "—"}</div>
              }
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {canWrite && <button className="btn" onClick={saveEditingEvent}>{t.save}</button>}
              <button className="btn btn-ghost" onClick={() => setEditingEvent(null)}>{t.cancel}</button>
              {canWrite && <button className="btn btn-red btn-sm" style={{ marginLeft: "auto" }} onClick={() => { deleteEvent(editingEvent.id); setEditingEvent(null); }}>🗑️ {t.delete}</button>}
            </div>
          </div>
        </div>
      )}
      {/* Cronograma */}
      <div className="card" style={{ marginBottom: 20, padding: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>{t.scheduleTitle}</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {phases.map(ph => {
            const start = new Date(ph.start + "T12:00:00");
            const end = new Date(ph.end + "T12:00:00");
            const active = today >= start && today <= end;
            return (
              <div key={ph.label} style={{ flex: 1, minWidth: 120, background: active ? ph.color : `${ph.color}22`, border: `2px solid ${ph.color}`, borderRadius: 8, padding: "8px 12px", position: "relative" }}>
                {active && <div style={{ position: "absolute", top: -6, right: 8, background: ph.color, color: "white", fontSize: 9, padding: "1px 6px", borderRadius: 4, fontWeight: 700 }}>{t.now}</div>}
                <div style={{ fontWeight: 700, fontSize: 12, color: active ? "white" : ph.color }}>{ph.label}</div>
                <div style={{ fontSize: 10, color: active ? "rgba(255,255,255,0.8)" : C.muted, marginTop: 2 }}>
                  {start.toLocaleDateString("ca-ES", { day: "numeric", month: "short" })} → {end.toLocaleDateString("ca-ES", { day: "numeric", month: "short" })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* View selector */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[["timeline", t.calendarViews[0]], ["daily", t.calendarViews[1]], ["board", t.calendarViews[2]]].map(([v, l]) => (
          <button key={v} onClick={() => setView(v)} className={`btn ${view === v ? "" : "btn-ghost"}`} style={{ fontSize: 12 }}>{l}</button>
        ))}
      </div>

      {view === "timeline" && (
        <div>
          <div className="section-title">{t.erasmusMeetings}</div>
          <div style={{ display: "grid", gap: 10 }}>
            {weeklyMeetings.map(d => {
              const dd = new Date(d + "T12:00:00");
              const passed = dd < today;
              return (
                <div key={d} className="card" style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 20px", borderLeft: `4px solid ${passed ? C.border : C.green}`, opacity: passed ? 0.6 : 1 }}>
                  <div style={{ background: passed ? C.bg : "#DCFCE7", borderRadius: 8, padding: "8px 16px", textAlign: "center", minWidth: 72, border: `1px solid ${passed ? C.border : "#BBF7D0"}` }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: passed ? C.muted : C.green }}>{dd.getDate()}</div>
                    <div style={{ fontSize: 10, color: C.light, letterSpacing: 0.5 }}>{dd.toLocaleDateString("ca-ES", { month: "short" }).toUpperCase()}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700 }}>{t.meetingLabel} — {dd.toLocaleDateString("ca-ES", { weekday: "long", day: "numeric", month: "long" })}</div>
                    <div style={{ fontSize: 12, color: C.muted }}>{t.meetingPlace}</div>
                  </div>
                  <span className="badge" style={{ background: passed ? C.bg : "#DCFCE7", color: passed ? C.muted : C.green, borderColor: passed ? C.border : "#BBF7D0" }}>{passed ? t.completed : t.pending2}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {view === "daily" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
            <div className="section-title" style={{ marginBottom: 0 }}>{t.week1}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {canWrite && <button className="btn btn-sm" onClick={() => setShowAddEvent(!showAddEvent)}>{t.addEvent}</button>}
              <div style={{ fontSize: 11, color: C.muted, display: "flex", alignItems: "center", gap: 6 }}>
                <span>⠿</span> {t.drag}
              </div>
            </div>
          </div>

          {showAddEvent && canWrite && (
            <div className="card shadow" style={{ marginBottom: 20, borderTop: `4px solid ${C.orange}` }}>
              <div style={{ fontWeight: 700, color: C.orange, marginBottom: 12 }}>{t.newEvent}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginBottom: 10 }}>
                <div>
                  <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 4, fontWeight: 600 }}>Data</label>
                  <input className="input" type="date" value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 4, fontWeight: 600 }}>Hora</label>
                  <input className="input" type="time" value={newEvent.time} onChange={e => setNewEvent({ ...newEvent, time: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 4, fontWeight: 600 }}>Tipus</label>
                  <select className="select" style={{ width: "100%" }} value={newEvent.type} onChange={e => setNewEvent({ ...newEvent, type: e.target.value })}>
                    {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 4, fontWeight: 600 }}>{t.eventTitle}</label>
                <input className="input" placeholder="Ex: Visita a empreses, Sopar d'equip..." value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, padding: "8px 12px", background: newEvent.isPublic ? "#F0FDF4" : "#F8FAFC", borderRadius: 8, border: `1px solid ${newEvent.isPublic ? "#BBF7D0" : C.border}` }}>
                <span style={{ fontSize: 12, color: newEvent.isPublic ? C.green : C.muted, flex: 1 }}>{newEvent.isPublic ? t.visibleAll : t.visiblePrivate}</span>
                <button onClick={() => setNewEvent({ ...newEvent, isPublic: !newEvent.isPublic })} style={{ background: newEvent.isPublic ? C.green : C.muted, color: "white", border: "none", borderRadius: 6, padding: "4px 12px", cursor: "pointer", fontSize: 12, fontFamily: "DM Sans, sans-serif", fontWeight: 700 }}>
                  {newEvent.isPublic ? t.makePrivate : t.makePublic}
                </button>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn btn-sm" onClick={addEvent}>{t.add}</button>
                <button className="btn btn-ghost btn-sm" onClick={() => setShowAddEvent(false)}>{t.cancel}</button>
              </div>
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 10, marginBottom: 24 }}>
            {week1.map(d => <DayCell key={d} dateStr={d} isTrip={d >= "2026-04-10"} />)}
          </div>
          <div className="section-title">{t.week2}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 10 }}>
            {week2.map(d => <DayCell key={d} dateStr={d} isTrip={d <= "2026-04-19"} />)}
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
            {Object.entries(typeLabels).map(([k, v]) => (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: typeColors[k] }} />
                <span style={{ color: C.muted }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === "board" && (
        <div>
          <div className="section-title">{t.boardTitle}</div>
          {canWrite ? (
            <div className="card" style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 5, fontWeight: 600 }}>Text del post-it</label>
                  <input className="input" placeholder={t.boardPlaceholder} value={noteText} onChange={e => setNoteText(e.target.value)} onKeyDown={e => e.key === "Enter" && addNote()} />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 5, fontWeight: 600 }}>{t.colorLabel}</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {[C.erasmus, C.orange, C.green, C.yellow, C.teal, "#E11D74"].map(col => (
                      <div key={col} onClick={() => setNoteColor(col)} style={{ width: 28, height: 28, borderRadius: "50%", background: col, cursor: "pointer", border: noteColor === col ? "3px solid #1E293B" : "3px solid transparent", transition: "transform 0.1s" }} />
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 5, fontWeight: 600 }}>{t.noteTarget}</label>
                  <select className="select" value={noteTarget} onChange={e => setNoteTarget(e.target.value)}>
                    <option value="board">📌 {t.noteBoard}</option>
                    <optgroup label="Setmana 1 (6–12 abr)">
                      {["2026-04-06","2026-04-07","2026-04-08","2026-04-09","2026-04-10","2026-04-11","2026-04-12"].map(d => <option key={d} value={d}>📅 {new Date(d + "T12:00:00").toLocaleDateString("ca-ES", { weekday: "long", day: "numeric" })}</option>)}
                    </optgroup>
                    <optgroup label="Setmana 2 (13–19 abr)">
                      {["2026-04-13","2026-04-14","2026-04-15","2026-04-16","2026-04-17","2026-04-18","2026-04-19"].map(d => <option key={d} value={d}>📅 {new Date(d + "T12:00:00").toLocaleDateString("ca-ES", { weekday: "long", day: "numeric" })}</option>)}
                    </optgroup>
                  </select>
                </div>
                <button className="btn" onClick={addNote}>{t.add}</button>
              </div>
            </div>
          ) : (
            <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10, padding: "14px 20px", marginBottom: 20, fontSize: 13, color: "#92400E" }}>
              🔒 La pissarra és només per a usuaris autoritzats. <strong>Inicia sessió</strong> per afegir notes.
            </div>
          )}

          {/* Board notes */}
          <div className="section-title" style={{ fontSize: 18 }}>📌 Notes a la pissarra</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 24, minHeight: 80 }}>
            {boardNotes.filter(n => n.target === "board").length === 0 && <div style={{ color: C.light, fontSize: 13, padding: 20 }}>La pissarra general està buida. Afegeix notes!</div>}
            {boardNotes.filter(n => n.target === "board").map(n => (
              <div key={n.id} style={{ background: `${n.color}15`, border: `2px solid ${n.color}55`, borderRadius: 10, padding: "12px 16px", maxWidth: 220, position: "relative" }}>
                <div style={{ fontSize: 13, color: C.text, lineHeight: 1.5 }}>{n.text}</div>
                <button onClick={() => setBoard(boardNotes.filter(x => x.id !== n.id))} style={{ position: "absolute", top: 5, right: 7, background: "none", border: "none", color: C.light, cursor: "pointer", fontSize: 13 }}>✕</button>
              </div>
            ))}
          </div>

          <div style={{ fontSize: 12, color: C.muted, padding: "12px 16px", background: "#FFF7ED", borderRadius: 8, border: `1px solid #FDBA74` }}>
            💡 Tip col·laboració en temps real: Per a pissarres col·laboratives avançades (dibuix, imatges, múltiples usuaris simultanis), recomanem <strong>Miro.com</strong> (pla gratuït) o <strong>FigJam</strong>. Els post-its creats aquí es guarden i sincronitzen entre tots els participants via la base de dades compartida.
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SF INFO ─────────────────────────────────────────────────
function SFInfoTab({ canWrite, t, sfNotes, setSfNotes }) {
  const [restTab, setRestTab] = useState("breakfast");
  const [currency, setCurrency] = useState({ eur: "", usd: "" });
  const [noteText, setNoteText] = useState("");
  const [noteUrl, setNoteUrl] = useState("");
  const [noteFile, setNoteFile] = useState(null);
  const [noteColor, setNoteColor] = useState("#003DA5");
  const [notePublic, setNotePublic] = useState(true);
  const rate = 1.085;

  const practical = [
    { icon: "🕐", title: "Diferència horària", info: "San Francisco (PDT, abril) = Blanes (CEST) – 9 hores. Quan a Blanes són les 18h, a SF són les 9h del matí." },
    { icon: "🌡️", title: "Clima a l'abril", info: "15–18°C de dia, 10–12°C de nit. Possible boira matinal (Karl the Fog). Portar jaqueta i capes. Pot ploure. Sabates còmodes per caminar." },
    { icon: "🔌", title: "Electricitat", info: "120V / 60Hz. Endolls tipus A (dos pins plans) i tipus B (tres pins). NECESSARI adaptador universal! No fa falta transformador per càrregues modernes." },
    { icon: "🚌", title: "Transport públic", info: "MUNI (metro + autobusos, $3/viatge). BART (tren, aerport ↔ centre $10.65). Clipper Card recomanada. App: SF MTA o Transit. Uber/Lyft abundants." },
    { icon: "🏥", title: "Salut", info: "UCSF Medical Center (públic). Carbon Health (urgent care privat, sense cita). Kaiser Permanente. CVS Pharmacy. Emergències: 911. Assegurança viatge inclosa al paquet Radialtours." },
  ];

  const rests = {
    breakfast: [
      { name: "Tartine Manufactory", address: "595 Alabama St, Mission", phone: "(415) 487-2600", price: "15–25$" },
      { name: "Sightglass Coffee", address: "270 7th St, SoMa", phone: "(415) 861-1313", price: "8–15$" },
      { name: "Brenda's French Soul Food", address: "652 Polk St, Tenderloin", phone: "(415) 345-8100", price: "15–25$" },
      { name: "Plow", address: "1299 18th St, Potrero Hill", phone: "(415) 821-7569", price: "20–30$" },
      { name: "Café Réveille", address: "4 Embarcadero Ctr, Financial District", phone: "(415) 757-0060", price: "12–20$" },
    ],
    lunch: [
      { name: "La Cocina Mercado", address: "101 Polk St, Civic Center", phone: "", price: "12–20$" },
      { name: "Tacolicious", address: "741 Valencia St, Mission", phone: "(415) 626-1344", price: "15–25$" },
      { name: "Bix", address: "56 Gold St, Financial District", phone: "(415) 433-6300", price: "30–45$" },
      { name: "Swan Oyster Depot", address: "1517 Polk St, Russian Hill", phone: "(415) 673-1101", price: "30–50$" },
      { name: "Burma Superstar", address: "309 Clement St, Richmond", phone: "(415) 387-2147", price: "15–25$" },
    ],
    dinner: [
      { name: "Zuni Café", address: "1658 Market St, Hayes Valley", phone: "(415) 552-2522", price: "40–65$" },
      { name: "Flour + Water", address: "2401 Harrison St, Mission", phone: "(415) 826-7000", price: "35–55$" },
      { name: "Rich Table", address: "199 Gough St, Hayes Valley", phone: "(415) 355-9085", price: "50–80$" },
      { name: "Nopalito", address: "306 Broderick St, Lower Haight", phone: "(415) 437-0303", price: "25–40$" },
      { name: "State Bird Provisions", address: "1529 Fillmore St, Fillmore", phone: "(415) 795-1272", price: "50–75$" },
    ],
    tourism: [
      { name: "Golden Gate Bridge", address: "Golden Gate Bridge, SF", phone: "", price: "Gratuït a peu/bici" },
      { name: "Alcatraz Island", address: "Pier 33, Embarcadero", phone: "(415) 981-7625", price: "45–50$ (inclou ferry)" },
      { name: "Fisherman's Wharf", address: "Jefferson St & Taylor St", phone: "", price: "Gratuït" },
      { name: "Ferry Building Marketplace", address: "1 Ferry Building, Embarcadero", phone: "", price: "Gratuït" },
      { name: "SFMOMA", address: "151 3rd St, SoMa", phone: "(415) 357-4000", price: "25$" },
    ],
  };
  const tabLabels = { breakfast: "☀️ Esmorzar", lunch: "🍽️ Dinar", dinner: "🌙 Sopar", tourism: "🗺️ Turisme" };

  const addNote = () => {
    if (!noteText.trim() && !noteFile && !noteUrl) return;
    const note = {
      id: Date.now(),
      text: noteText,
      url: noteUrl,
      image: noteFile,
      color: noteColor,
      isPublic: notePublic,
      author: "",
      date: new Date().toLocaleDateString("ca-ES"),
    };
    setSfNotes([note, ...sfNotes]);
    setNoteText(""); setNoteUrl(""); setNoteFile(null);
  };

  const visibleNotes = sfNotes.filter(n => canWrite || n.isPublic);

  return (
    <div>
      {/* Botó itinerari — visible per a tothom */}
      <div style={{ marginBottom: 20 }}>
        <a href="https://maps.app.goo.gl/mbndaH2arNdg6oaHA" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontSize: 14, padding: "10px 28px", textDecoration: "none" }}>
          🗺️ Itinerari
        </a>
      </div>

      {/* Pissarra de suggeriments */}
      <div className="card shadow" style={{ marginBottom: 28, borderTop: `4px solid ${C.teal}` }}>
        <div style={{ fontFamily: "DM Serif Display", fontSize: 20, color: C.teal, marginBottom: 4 }}>📌 Pissarra de suggeriments</div>
        <div style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>Comparteix idees, llocs per visitar, restaurants, consells... Tothom ho pot veure (si és públic).</div>

        {/* Formulari — només usuaris */}
        {canWrite && (
          <div style={{ background: C.bg, borderRadius: 10, padding: 16, marginBottom: 20, border: `1px solid ${C.border}` }}>
            <textarea
              className="input" rows="3" placeholder="Escriu un suggeriment, idea o lloc per visitar..."
              value={noteText} onChange={e => setNoteText(e.target.value)}
              style={{ width: "100%", marginBottom: 10 }}
            />
            {/* URL */}
            <input className="input" placeholder="🔗 URL (opcional)" value={noteUrl} onChange={e => setNoteUrl(e.target.value)} style={{ marginBottom: 10 }} />
            {/* Foto */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12, alignItems: "center" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: C.erasmusLight, border: `1.5px solid ${C.erasmus}44`, borderRadius: 8, cursor: "pointer", fontSize: 12, color: C.erasmus, fontWeight: 600 }}>
                📁 Afegir foto
                <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
                  const file = e.target.files[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = ev => setNoteFile(ev.target.result);
                  reader.readAsDataURL(file);
                }} />
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: "#F0FDF4", border: `1.5px solid ${C.green}44`, borderRadius: 8, cursor: "pointer", fontSize: 12, color: C.green, fontWeight: 600 }}>
                📸 Fer foto
                <input type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={e => {
                  const file = e.target.files[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = ev => setNoteFile(ev.target.result);
                  reader.readAsDataURL(file);
                }} />
              </label>
              {noteFile && (
                <>
                  <img src={noteFile} alt="preview" style={{ height: 48, borderRadius: 6, border: `1px solid ${C.border}` }} />
                  <button onClick={() => setNoteFile(null)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 16 }}>✕</button>
                </>
              )}
            </div>
            {/* Color i visibilitat */}
            <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: 6 }}>
                {[C.erasmus, C.teal, C.green, C.orange, "#E11D74", "#7C3AED"].map(col => (
                  <div key={col} onClick={() => setNoteColor(col)} style={{ width: 24, height: 24, borderRadius: "50%", background: col, cursor: "pointer", border: noteColor === col ? "3px solid #1E293B" : "3px solid transparent" }} />
                ))}
              </div>
              <button onClick={() => setNotePublic(!notePublic)} style={{ background: notePublic ? "#DCFCE7" : "#F1F5F9", border: `1px solid ${notePublic ? "#BBF7D0" : C.border}`, color: notePublic ? C.green : C.muted, borderRadius: 8, padding: "5px 14px", cursor: "pointer", fontSize: 12, fontFamily: "DM Sans, sans-serif", fontWeight: 600 }}>
                {notePublic ? "👁️ Públic" : "🔒 Privat"}
              </button>
              <button className="btn" onClick={addNote} style={{ marginLeft: "auto" }}>Publicar</button>
            </div>
          </div>
        )}

        {/* Post-its */}
        {visibleNotes.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 20px", color: C.light, border: `1px dashed ${C.border}`, borderRadius: 10 }}>
            Encara no hi ha suggeriments. {canWrite ? "Sigues el primer!" : ""}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
            {visibleNotes.map(n => (
              <div key={n.id} style={{ background: `${n.color}15`, border: `2px solid ${n.color}44`, borderRadius: 12, padding: 16, position: "relative" }}>
                {canWrite && (
                  <button onClick={() => setSfNotes(sfNotes.filter(x => x.id !== n.id))} style={{ position: "absolute", top: 8, right: 8, background: "none", border: "none", color: C.light, cursor: "pointer", fontSize: 14 }}>✕</button>
                )}
                {!n.isPublic && <div style={{ fontSize: 10, color: C.muted, marginBottom: 6 }}>🔒 Privat</div>}
                {n.text && <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6, marginBottom: n.image || n.url ? 10 : 0 }}>{n.text}</div>}
                {n.image && <img src={n.image} alt="" style={{ width: "100%", borderRadius: 8, marginBottom: n.url ? 8 : 0 }} />}
                {n.url && <a href={n.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: n.color, fontWeight: 600, wordBreak: "break-all" }}>🔗 {n.url}</a>}
                <div style={{ fontSize: 10, color: C.light, marginTop: 8 }}>{n.date}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Practical */}
      <div className="section-title">Informació pràctica</div>
      <div className="grid-2" style={{ marginBottom: 28 }}>
        {practical.map(item => (
          <div key={item.title} className="card shadow" style={{ display: "flex", gap: 16 }}>
            <div style={{ fontSize: 30, flexShrink: 0 }}>{item.icon}</div>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 5, color: C.erasmus }}>{item.title}</div>
              <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.65 }}>{item.info}</div>
            </div>
          </div>
        ))}
        {/* Currency */}
        <div className="card shadow">
          <div style={{ fontWeight: 700, marginBottom: 12, color: C.erasmus }}>💱 Convertidor EUR ↔ USD</div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 4 }}>€ Euros</label>
              <input className="input" type="number" placeholder="0.00" value={currency.eur} onChange={e => { const v = e.target.value; setCurrency({ eur: v, usd: v ? (parseFloat(v) * rate).toFixed(2) : "" }); }} />
            </div>
            <div style={{ fontSize: 20, color: C.erasmus, marginTop: 16 }}>⇄</div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 4 }}>$ Dòlars</label>
              <input className="input" type="number" placeholder="0.00" value={currency.usd} onChange={e => { const v = e.target.value; setCurrency({ usd: v, eur: v ? (parseFloat(v) / rate).toFixed(2) : "" }); }} />
            </div>
          </div>
          <div style={{ fontSize: 11, color: C.light, marginTop: 8, textAlign: "center" }}>1 EUR ≈ {rate} USD (taxa orientativa abril 2026)</div>
        </div>
      </div>

      {/* Restaurants */}
      <div className="section-title">On menjar i què fer</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
        {Object.entries(tabLabels).map(([k, l]) => (
          <button key={k} onClick={() => setRestTab(k)} className={`btn ${restTab === k ? "" : "btn-ghost"}`} style={{ fontSize: 12 }}>{l}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
        {rests[restTab].map(r => (
          <div key={r.name} className="card shadow hover-lift" style={{ borderTop: `3px solid ${C.erasmus}` }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>{r.name}</div>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>📍 {r.address}</div>
            {r.phone && <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>📞 {r.phone}</div>}
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span className="badge" style={{ background: "#FFF7ED", color: "#9A3412", borderColor: "#FDBA74" }}>{r.price}</span>
              <button onClick={() => { /* search logic */ }} style={{ background: "none", border: "none", color: C.erasmus, cursor: "pointer", fontSize: 12, textDecoration: "underline" }} onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(r.name + " " + r.address + " San Francisco")}`, "_blank")}>Ver al mapa 🗺️</button>
            </div>
          </div>
        ))}
      </div>

      {/* Hotel */}
      <div className="card shadow" style={{ marginTop: 24, borderLeft: `5px solid ${C.teal}` }}>
        <div style={{ fontFamily: "DM Serif Display", fontSize: 20, color: C.teal, marginBottom: 10 }}>
          🏨 Allotjament: <a href="https://www.foundhotels.com/" target="_blank" rel="noopener noreferrer" style={{ color: C.teal, textDecoration: "underline" }}>FOUND Hotel Carlton, Nob Hill</a>
        </div>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", fontSize: 13, color: C.muted }}>
          <div>📬 1075 Sutter St, Nob Hill, SF 94109</div>
          <div>🛏️ 2 dobles + 1 individual</div>
          <div>⭐ 4.1/5 Google (1.175 res.)</div>
          <div>📅 Check-in: 10/04 · Check-out: 18/04</div>
          <div>🍳 Esmorzar NO inclòs</div>
        </div>
      </div>
    </div>
  );
}

// ─── BUDGET ──────────────────────────────────────────────────
function BudgetTab({ expenses, setExpenses, prevExpenses, setPrevExpenses, canWrite }) {
  const [form, setForm] = useState({ date: "", place: "", amount: "", comment: "", persons: PARTICIPANTS.map(p => p.name), category: "Menjar" });
  const [filterPerson, setFilterPerson] = useState("Tots");
  const [filterCat, setFilterCat] = useState("Totes");
  const [prevEditing, setPrevEditing] = useState(null);

  const categories = ["Menjar", "Transport", "Lleure", "Altres"];
  const catColors = { Menjar: C.orange, Transport: C.erasmus, Lleure: C.green, Altres: "#8B5CF6" };
  const purple = "#7C3AED";

  const togglePerson = (name) => {
    const cur = form.persons;
    if (cur.includes(name)) { if (cur.length === 1) return; setForm({ ...form, persons: cur.filter(p => p !== name) }); }
    else setForm({ ...form, persons: [...cur, name] });
  };

  const add = () => {
    if (!form.date || !form.place || !form.amount || !canWrite) return;
    const totalAmount = parseFloat(form.amount);
    const perPerson = totalAmount / form.persons.length;
    const newEntries = form.persons.map(person => ({
      id: Date.now() + Math.random(), date: form.date, place: form.place,
      amount: parseFloat(perPerson.toFixed(2)), person, category: form.category,
      comment: form.comment,
      shared: form.persons.length > 1 ? `Compartida ${form.persons.length}p` : null
    }));
    setExpenses([...expenses, ...newEntries]);
    setForm({ ...form, place: "", amount: "", comment: "" });
  };

  const addPrevRow = () => {
    setPrevExpenses([...prevExpenses, { id: Date.now(), label: "Nova despesa prèvia", amount: 0, persons: PARTICIPANTS.map(p => p.name) }]);
  };

  const filtered = expenses.filter(e => (filterPerson === "Tots" || e.person === filterPerson) && (filterCat === "Totes" || e.category === filterCat));
  const total = filtered.reduce((s, e) => s + e.amount, 0);

  const tripDays = ["2026-04-10","2026-04-11","2026-04-12","2026-04-13","2026-04-14","2026-04-15","2026-04-16","2026-04-17","2026-04-18"];
  const byDay = tripDays.map(day => {
    const dayExp = expenses.filter(e => e.date === day);
    const dayTotal = dayExp.reduce((s, e) => s + e.amount, 0);
    const byCat = {};
    categories.forEach(c => { byCat[c] = dayExp.filter(e => e.category === c).reduce((s, e) => s + e.amount, 0); });
    return { day, dayTotal, byCat };
  });
  const grandTotal = byDay.reduce((s, d) => s + d.dayTotal, 0);
  const byPerson = PARTICIPANTS.map(p => ({ ...p, total: expenses.filter(e => e.person === p.name).reduce((s, e) => s + e.amount, 0) }));
  const byCatTotal = categories.map(c => ({ cat: c, total: expenses.filter(e => e.category === c).reduce((s, e) => s + e.amount, 0) }));
  const prevTotalPerPerson = (name) => prevExpenses.reduce((s, pe) => pe.persons.includes(name) && pe.amount > 0 ? s + pe.amount : s, 0);
  const durantPerPerson = (name) => expenses.filter(e => e.person === name).reduce((s, e) => s + e.amount, 0);

  // Dades gràfic de sectors: categories + prev categories
  const prevCatTotals = [
    { label: "ESTA", total: prevExpenses.filter(p => p.label.includes("ESTA")).reduce((s,p) => s + p.amount * p.persons.length, 0), color: purple },
    { label: "Vols+Allotj.", total: prevExpenses.filter(p => p.label.includes("Vols") || p.label.includes("Allotjament")).reduce((s,p) => s + p.amount * p.persons.length, 0), color: C.erasmus },
    { label: "Transfers", total: prevExpenses.filter(p => p.label.includes("Transfer")).reduce((s,p) => s + p.amount * p.persons.length, 0), color: C.teal },
    { label: "Altres prev.", total: prevExpenses.filter(p => !p.label.includes("ESTA") && !p.label.includes("Vols") && !p.label.includes("Allotjament") && !p.label.includes("Transfer")).reduce((s,p) => s + p.amount * p.persons.length, 0), color: "#E11D74" },
    ...categories.map(c => ({ label: c, total: byCatTotal.find(x => x.cat === c)?.total || 0, color: catColors[c] })),
  ].filter(d => d.total > 0);
  const pieTotal = prevCatTotals.reduce((s, d) => s + d.total, 0);

  // Exportar a Excel (CSV)
  const exportExcel = () => {
    const rows = [];
    rows.push(["DESPESES PRÈVIES"]);
    rows.push(["Concepte","Import/persona","Participants","Total"]);
    prevExpenses.forEach(pe => rows.push([pe.label, pe.amount.toFixed(2)+"€", pe.persons.join(", "), (pe.amount*pe.persons.length).toFixed(2)+"€"]));
    rows.push([]);
    rows.push(["DESPESES DURANT LA MOBILITAT"]);
    rows.push(["Data","Lloc","Persona","Categoria","Import","Comentari","Compartida"]);
    expenses.sort((a,b) => new Date(a.date)-new Date(b.date)).forEach(e => rows.push([e.date, e.place, e.person, e.category, e.amount.toFixed(2)+"€", e.comment||"", e.shared||""]));
    rows.push([]);
    rows.push(["RESUM PER PERSONA"]);
    rows.push(["Participant","Prèvies","Durant mobilitat","TOTAL"]);
    PARTICIPANTS.forEach(p => rows.push([p.name, prevTotalPerPerson(p.name).toFixed(2)+"€", durantPerPerson(p.name).toFixed(2)+"€", (prevTotalPerPerson(p.name)+durantPerPerson(p.name)).toFixed(2)+"€"]));
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF"+csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "pressupost_SF_2026.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div className="section-title" style={{ marginBottom: 0 }}>Control de Pressupost</div>
        <button onClick={exportExcel} style={{ background: "#16A34A", color: "white", border: "none", borderRadius: 8, padding: "8px 18px", cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "DM Sans, sans-serif", display: "flex", alignItems: "center", gap: 6 }}>
          📥 Exportar Excel
        </button>
      </div>

      {/* 1. DESPESES PRÈVIES */}
      <div className="section-title" style={{ color: purple }}>Despeses prèvies al viatge</div>
      <div style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>Pagades abans de la sortida. Clica ✏️ per editar. Pots afegir files noves.</div>
      <div className="card shadow" style={{ padding: 0, overflow: "auto", marginBottom: 8 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 700 }}>
          <thead>
            <tr style={{ background: purple }}>
              <th style={{ padding: "10px 16px", textAlign: "left", color: "white", fontWeight: 700 }}>Concepte</th>
              <th style={{ padding: "10px 12px", color: "white", fontWeight: 700, textAlign: "right" }}>Import/p.</th>
              {PARTICIPANTS.map(p => <th key={p.id} style={{ padding: "10px 8px", color: "white", fontWeight: 600, textAlign: "center", fontSize: 11 }}>{p.emoji}<br/>{p.name.split(" ")[0]}</th>)}
              <th style={{ padding: "10px 14px", color: "white", fontWeight: 800, textAlign: "right" }}>TOTAL</th>
              {canWrite && <th style={{ padding: "10px 8px", color: "rgba(255,255,255,0.6)", textAlign: "center", fontSize: 11 }}>✏️</th>}
            </tr>
          </thead>
          <tbody>
            {prevExpenses.map((pe, idx) => (
              <tr key={pe.id} style={{ background: idx%2===0?"white":"#F8FAFC", borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: "9px 16px", fontWeight: 600 }}>
                  {prevEditing===pe.id ? <input className="input" value={pe.label} onChange={e => setPrevExpenses(prevExpenses.map(x=>x.id===pe.id?{...x,label:e.target.value}:x))} style={{ fontSize: 12 }} /> : pe.label}
                </td>
                <td style={{ padding: "9px 12px", textAlign: "right", fontWeight: 700, color: purple }}>
                  {prevEditing===pe.id ? <input className="input" type="number" value={pe.amount} onChange={e => setPrevExpenses(prevExpenses.map(x=>x.id===pe.id?{...x,amount:parseFloat(e.target.value)||0}:x))} style={{ width: 80, fontSize: 12 }} /> : `${pe.amount.toFixed(2)}€`}
                </td>
                {PARTICIPANTS.map(p => (
                  <td key={p.id} style={{ padding: "9px 8px", textAlign: "center" }}>
                    {prevEditing===pe.id
                      ? <input type="checkbox" checked={pe.persons.includes(p.name)} onChange={() => setPrevExpenses(prevExpenses.map(x=>x.id===pe.id?{...x,persons:x.persons.includes(p.name)?x.persons.filter(n=>n!==p.name):[...x.persons,p.name]}:x))} />
                      : pe.persons.includes(p.name) ? <span style={{ color: purple, fontWeight: 700, fontSize: 12 }}>{pe.amount.toFixed(2)}€</span> : <span style={{ color: C.light }}>—</span>}
                  </td>
                ))}
                <td style={{ padding: "9px 14px", textAlign: "right", fontWeight: 800, color: purple }}>{(pe.amount*pe.persons.length).toFixed(2)}€</td>
                {canWrite && <td style={{ padding: "9px 8px", textAlign: "center" }}>
                  <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
                    {prevEditing===pe.id
                      ? <button onClick={() => setPrevEditing(null)} style={{ background: C.green, color: "white", border: "none", borderRadius: 6, padding: "3px 8px", cursor: "pointer", fontSize: 11 }}>✓</button>
                      : <button onClick={() => setPrevEditing(pe.id)} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: "3px 8px", cursor: "pointer", fontSize: 11, color: C.muted }}>✏️</button>}
                    <button onClick={() => setPrevExpenses(prevExpenses.filter(x=>x.id!==pe.id))} style={{ background: "#FEF2F2", border: `1px solid #FECACA`, color: C.red, borderRadius: 6, padding: "3px 8px", cursor: "pointer", fontSize: 11, marginLeft: 2 }}>✕</button>
                  </div>
                </td>}
              </tr>
            ))}
            <tr style={{ background: "#EDE9FE", borderTop: `2px solid ${purple}` }}>
              <td style={{ padding: "10px 16px", fontWeight: 800, color: purple }}>TOTAL PREVI</td>
              <td />
              {PARTICIPANTS.map(p => <td key={p.id} style={{ padding: "10px 8px", textAlign: "center", fontWeight: 800, color: purple }}>{prevTotalPerPerson(p.name).toFixed(2)}€</td>)}
              <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 900, color: purple, fontSize: 15 }}>{prevExpenses.reduce((s,pe)=>s+pe.amount*pe.persons.length,0).toFixed(2)}€</td>
              {canWrite && <td />}
            </tr>
          </tbody>
        </table>
      </div>
      {canWrite && (
        <button onClick={addPrevRow} style={{ marginBottom: 32, background: "#EDE9FE", border: `1.5px dashed ${purple}`, color: purple, borderRadius: 8, padding: "7px 18px", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "DM Sans, sans-serif" }}>
          + Afegir fila
        </button>
      )}

      {/* 2. DESPESES DURANT LA MOBILITAT */}
      <div className="section-title">Despeses durant la mobilitat</div>

      {canWrite && (
        <div className="card shadow" style={{ marginBottom: 20, borderTop: `4px solid ${C.orange}` }}>
          <div style={{ fontWeight: 700, marginBottom: 14, color: C.orange }}>+ Registrar despesa</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 12 }}>
            {[["Data","date","date"],["Lloc / Comerç","place","text"],["Import TOTAL (€)","amount","number"]].map(([l,k,tp]) => (
              <div key={k}>
                <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 4, fontWeight: 600 }}>{l}</label>
                <input className="input" type={tp} value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} step={tp==="number"?"0.01":undefined} min={tp==="number"?"0":undefined} />
              </div>
            ))}
            <div>
              <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 4, fontWeight: 600 }}>Categoria</label>
              <select className="select" style={{ width: "100%" }} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 4, fontWeight: 600 }}>Comentari (opcional)</label>
              <input className="input" placeholder="Ex: sopar de grup, entrada museu..." value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })} />
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <label style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>Repartir entre:</label>
              <button onClick={() => setForm({ ...form, persons: PARTICIPANTS.map(p => p.name) })} style={{ fontSize: 11, background: "none", border: `1px solid ${C.border}`, borderRadius: 6, padding: "2px 8px", cursor: "pointer", color: C.muted }}>Tots</button>
              {form.persons.length > 1 && form.amount && <span style={{ fontSize: 11, color: C.green, fontWeight: 600 }}>{(parseFloat(form.amount)/form.persons.length).toFixed(2)}€/persona</span>}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {PARTICIPANTS.map(p => (
                <button key={p.id} onClick={() => togglePerson(p.name)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 20, border: `1.5px solid ${form.persons.includes(p.name) ? p.color : C.border}`, background: form.persons.includes(p.name) ? `${p.color}18` : "white", color: form.persons.includes(p.name) ? p.color : C.muted, cursor: "pointer", fontSize: 12, fontWeight: form.persons.includes(p.name) ? 700 : 400, fontFamily: "DM Sans, sans-serif" }}>
                  {p.emoji} {p.name.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
          <button className="btn" onClick={add}>Afegir despesa</button>
        </div>
      )}

      {/* Stats per persona i categoria */}
      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="card shadow">
          <div style={{ fontSize: 13, fontWeight: 700, color: C.muted, marginBottom: 12 }}>Per persona (mobilitat)</div>
          {byPerson.map(p => (
            <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 18 }}>{p.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
                  <span style={{ color: C.text, fontWeight: 500 }}>{p.name.split(" ")[0]}</span>
                  <span style={{ color: p.color, fontWeight: 700 }}>{p.total.toFixed(2)}€</span>
                </div>
                <div style={{ height: 5, background: C.bg, borderRadius: 3 }}>
                  <div style={{ height: "100%", width: `${Math.min(100,(p.total/(Math.max(...byPerson.map(x=>x.total))||1))*100)}%`, background: p.color, borderRadius: 3 }} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="card shadow">
          <div style={{ fontSize: 13, fontWeight: 700, color: C.muted, marginBottom: 12 }}>Per categoria</div>
          {byCatTotal.map(c => (
            <div key={c.cat} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, padding: "7px 12px", background: `${catColors[c.cat]}12`, borderRadius: 8, border: `1px solid ${catColors[c.cat]}33` }}>
              <span className="badge" style={{ background: `${catColors[c.cat]}20`, color: catColors[c.cat], borderColor: `${catColors[c.cat]}44` }}>{c.cat}</span>
              <span style={{ fontWeight: 700, color: catColors[c.cat] }}>{c.total.toFixed(2)}€</span>
            </div>
          ))}
          <hr />
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 16 }}>
            <span style={{ color: C.text }}>TOTAL mobilitat</span>
            <span style={{ color: C.orange }}>{expenses.reduce((s,e)=>s+e.amount,0).toFixed(2)}€</span>
          </div>
        </div>
      </div>

      {/* Llista de despeses */}
      <div style={{ display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap", alignItems: "center" }}>
        <select className="select" value={filterPerson} onChange={e => setFilterPerson(e.target.value)}>
          <option>Tots</option>
          {PARTICIPANTS.map(p => <option key={p.id}>{p.name}</option>)}
        </select>
        <select className="select" value={filterCat} onChange={e => setFilterCat(e.target.value)}>
          <option>Totes</option>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
        <div style={{ marginLeft: "auto", fontWeight: 800, fontSize: 16, color: C.orange }}>Filtrat: {total.toFixed(2)}€</div>
      </div>
      {filtered.length > 0 && (
        <div className="card shadow" style={{ padding: 0, overflow: "hidden", marginBottom: 32 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#F8FAFC", borderBottom: `1px solid ${C.border}` }}>
                {["Data","Lloc","Persona","Cat.","Import","Comentari",""].map(h => <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 700, color: C.muted, fontSize: 11 }}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.sort((a,b) => new Date(b.date)-new Date(a.date)).map(e => (
                <tr key={e.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: "9px 12px", color: C.muted, fontSize: 12 }}>{fmtDate(e.date)}</td>
                  <td style={{ padding: "9px 12px", fontWeight: 500 }}>{e.place}{e.shared && <span style={{ fontSize: 10, color: C.teal, marginLeft: 6, background: `${C.teal}15`, padding: "1px 5px", borderRadius: 4 }}>{e.shared}</span>}</td>
                  <td style={{ padding: "9px 12px", color: C.muted, fontSize: 12 }}>{e.person.split(" ")[0]}</td>
                  <td style={{ padding: "9px 12px" }}><span className="badge" style={{ background: `${catColors[e.category]}18`, color: catColors[e.category], borderColor: `${catColors[e.category]}44`, fontSize: 10 }}>{e.category}</span></td>
                  <td style={{ padding: "9px 12px", fontWeight: 700, color: C.orange, whiteSpace: "nowrap" }}>{e.amount.toFixed(2)}€</td>
                  <td style={{ padding: "9px 12px", fontSize: 12, color: C.muted }}>{e.comment || "—"}</td>
                  <td style={{ padding: "9px 12px" }}>{canWrite && <button onClick={() => setExpenses(expenses.filter(x=>x.id!==e.id))} style={{ background: "#FEF2F2", border: `1px solid #FECACA`, color: C.red, padding: "2px 8px", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>✕</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tresoreria diària */}
      <div className="section-title">Taula de Tresoreria diària</div>
      <div style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>Despeses durant el viatge per dia. Valors en euros (€).</div>
      <div className="card shadow" style={{ padding: 0, overflow: "auto", marginBottom: 32 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, minWidth: 500 }}>
          <thead>
            <tr style={{ background: C.erasmus }}>
              <th style={{ padding: "10px 14px", textAlign: "left", color: "white", fontWeight: 700 }}>Dia</th>
              {categories.map(c => <th key={c} style={{ padding: "10px 12px", color: "white", fontWeight: 700, textAlign: "right" }}>{c}</th>)}
              <th style={{ padding: "10px 14px", color: "white", fontWeight: 800, textAlign: "right" }}>TOTAL DIA</th>
              <th style={{ padding: "10px 14px", color: "rgba(255,255,255,0.8)", fontWeight: 700, textAlign: "right" }}>Acumulat</th>
            </tr>
          </thead>
          <tbody>
            {byDay.map((row, idx) => {
              const accum = byDay.slice(0,idx+1).reduce((s,r)=>s+r.dayTotal,0);
              const hasData = row.dayTotal > 0;
              const d = new Date(row.day+"T12:00:00");
              return (
                <tr key={row.day} style={{ background: hasData?"#FFFBEB":idx%2===0?"white":"#F8FAFC", borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: "9px 14px", fontWeight: hasData?700:400, color: hasData?C.text:C.muted, whiteSpace: "nowrap" }}>{d.toLocaleDateString("ca-ES",{weekday:"short",day:"numeric",month:"short"})}</td>
                  {categories.map(c => <td key={c} style={{ padding: "9px 12px", textAlign: "right", color: row.byCat[c]>0?catColors[c]:C.light, fontWeight: row.byCat[c]>0?700:400 }}>{row.byCat[c]>0?row.byCat[c].toFixed(2):"—"}</td>)}
                  <td style={{ padding: "9px 14px", textAlign: "right", fontWeight: 800, color: hasData?C.orange:C.light }}>{hasData?row.dayTotal.toFixed(2)+"€":"—"}</td>
                  <td style={{ padding: "9px 14px", textAlign: "right", color: C.muted, fontSize: 11 }}>{accum>0?accum.toFixed(2)+"€":"—"}</td>
                </tr>
              );
            })}
            <tr style={{ background: C.erasmusLight, borderTop: `2px solid ${C.erasmus}` }}>
              <td style={{ padding: "10px 14px", fontWeight: 800, color: C.erasmus }}>TOTAL</td>
              {categories.map(c => { const tv=byDay.reduce((s,r)=>s+r.byCat[c],0); return <td key={c} style={{ padding: "10px 12px", textAlign: "right", fontWeight: 800, color: tv>0?catColors[c]:C.light }}>{tv>0?tv.toFixed(2)+"€":"—"}</td>; })}
              <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 900, color: C.orange, fontSize: 14 }}>{grandTotal.toFixed(2)}€</td>
              <td />
            </tr>
          </tbody>
        </table>
      </div>

      {/* 3. RESUM TOTAL PER PERSONA */}
      <div className="section-title">Resum total per persona</div>
      <div className="card shadow" style={{ padding: 0, overflow: "auto", marginBottom: 32 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: C.text }}>
              <th style={{ padding: "10px 16px", textAlign: "left", color: "white", fontWeight: 700 }}>Participant</th>
              <th style={{ padding: "10px 14px", color: "white", fontWeight: 700, textAlign: "right" }}>Prèvies</th>
              <th style={{ padding: "10px 14px", color: "white", fontWeight: 700, textAlign: "right" }}>Mobilitat</th>
              <th style={{ padding: "10px 14px", color: "#FFED00", fontWeight: 800, textAlign: "right" }}>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {PARTICIPANTS.map((p, idx) => {
              const prev = prevTotalPerPerson(p.name);
              const durant = durantPerPerson(p.name);
              return (
                <tr key={p.id} style={{ background: idx%2===0?"white":"#F8FAFC", borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: "11px 16px", fontWeight: 600 }}>{p.emoji} {p.name.split(" ")[0]}</td>
                  <td style={{ padding: "11px 14px", textAlign: "right", color: purple, fontWeight: 600 }}>{prev.toFixed(2)}€</td>
                  <td style={{ padding: "11px 14px", textAlign: "right", color: C.orange, fontWeight: 600 }}>{durant.toFixed(2)}€</td>
                  <td style={{ padding: "11px 14px", textAlign: "right", fontWeight: 800, color: C.text, fontSize: 14 }}>{(prev+durant).toFixed(2)}€</td>
                </tr>
              );
            })}
            <tr style={{ background: "#1E293B", borderTop: `2px solid ${C.text}` }}>
              <td style={{ padding: "11px 16px", fontWeight: 800, color: "white" }}>TOTAL GLOBAL</td>
              <td style={{ padding: "11px 14px", textAlign: "right", fontWeight: 800, color: "#C4B5FD" }}>{prevExpenses.reduce((s,pe)=>s+pe.amount*pe.persons.length,0).toFixed(2)}€</td>
              <td style={{ padding: "11px 14px", textAlign: "right", fontWeight: 800, color: "#FCD34D" }}>{expenses.reduce((s,e)=>s+e.amount,0).toFixed(2)}€</td>
              <td style={{ padding: "11px 14px", textAlign: "right", fontWeight: 900, color: "#FFED00", fontSize: 16 }}>{(prevExpenses.reduce((s,pe)=>s+pe.amount*pe.persons.length,0)+expenses.reduce((s,e)=>s+e.amount,0)).toFixed(2)}€</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 4. GRÀFIC DE SECTORS */}
      {pieTotal > 0 && (
        <div className="card shadow" style={{ marginBottom: 24 }}>
          <div className="section-title" style={{ marginBottom: 16 }}>Distribució de despeses</div>
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
            <svg width="200" height="200" viewBox="0 0 200 200">
              {(() => {
                let startAngle = -Math.PI / 2;
                return prevCatTotals.map((d, i) => {
                  const pct = d.total / pieTotal;
                  const angle = pct * 2 * Math.PI;
                  const x1 = 100 + 90 * Math.cos(startAngle);
                  const y1 = 100 + 90 * Math.sin(startAngle);
                  startAngle += angle;
                  const x2 = 100 + 90 * Math.cos(startAngle);
                  const y2 = 100 + 90 * Math.sin(startAngle);
                  const large = angle > Math.PI ? 1 : 0;
                  return (
                    <path key={i}
                      d={`M100,100 L${x1},${y1} A90,90 0 ${large},1 ${x2},${y2} Z`}
                      fill={d.color} stroke="white" strokeWidth="2"
                    />
                  );
                });
              })()}
              <circle cx="100" cy="100" r="40" fill="white" />
              <text x="100" y="96" textAnchor="middle" fontSize="11" fill={C.muted} fontWeight="600">TOTAL</text>
              <text x="100" y="113" textAnchor="middle" fontSize="12" fill={C.text} fontWeight="800">{pieTotal.toFixed(0)}€</text>
            </svg>
            <div style={{ display: "grid", gap: 8 }}>
              {prevCatTotals.map(d => (
                <div key={d.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 14, height: 14, borderRadius: 3, background: d.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: C.text, minWidth: 100 }}>{d.label}</span>
                  <span style={{ fontWeight: 700, color: d.color }}>{d.total.toFixed(2)}€</span>
                  <span style={{ fontSize: 11, color: C.muted }}>({((d.total/pieTotal)*100).toFixed(1)}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── DIARY ───────────────────────────────────────────────────
function DiaryTab({ entries, setEntries, canWrite, t }) {
  const [form, setForm] = useState({ author: PARTICIPANTS[0].name, text: "", date: new Date().toISOString().split("T")[0], type: "text", url: "", isPublic: true });
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [filterPerson, setFilterPerson] = useState("all");
  const [filterDay, setFilterDay] = useState("all");
  const typeIcons = { text: "📝", photo: "📸", video: "🎥", link: "🔗" };

  const tripDays = ["2026-04-10","2026-04-11","2026-04-12","2026-04-13","2026-04-14","2026-04-15","2026-04-16","2026-04-17","2026-04-18","2026-04-19"];

  const add = () => {
    if (!form.text.trim()) return;
    if (editId) {
      setEntries(entries.map(e => e.id === editId ? { ...e, ...form } : e));
      setEditId(null);
    } else {
      setEntries([{ id: Date.now(), ...form }, ...entries]);
    }
    setForm({ author: PARTICIPANTS[0].name, text: "", date: new Date().toISOString().split("T")[0], type: "text", url: "", isPublic: true });
    setOpen(false);
  };

  const startEdit = (e) => { setForm({ ...e }); setEditId(e.id); setOpen(true); };
  const togglePublic = (id) => setEntries(entries.map(e => e.id === id ? { ...e, isPublic: !e.isPublic } : e));

  // Filter: public users only see public entries
  const visible = entries.filter(e => canWrite || e.isPublic !== false);
  const filtered = visible.filter(e =>
    (filterPerson === "all" || e.author === filterPerson) &&
    (filterDay === "all" || e.date === filterDay)
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div className="section-title" style={{ marginBottom: 0 }}>{t.diaryTitle}</div>
        {canWrite && <button className="btn" onClick={() => { setOpen(!open); setEditId(null); setForm({ author: PARTICIPANTS[0].name, text: "", date: new Date().toISOString().split("T")[0], type: "text", url: "", isPublic: true }); }}>{t.addEntry}</button>}
      </div>

      {!canWrite && (
        <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10, padding: "14px 20px", marginBottom: 20, fontSize: 13, color: "#92400E" }}>
          🔒 Només els usuaris autoritzats poden escriure al diari. Les entrades públiques es mostren a continuació.
        </div>
      )}

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <select className="select" value={filterPerson} onChange={e => setFilterPerson(e.target.value)}>
          <option value="all">{t.all} — {t.person}</option>
          {PARTICIPANTS.map(p => <option key={p.id} value={p.name}>{p.emoji} {p.name.split(" ")[0]}</option>)}
        </select>
        <select className="select" value={filterDay} onChange={e => setFilterDay(e.target.value)}>
          <option value="all">{t.all} — {t.day}</option>
          {tripDays.map(d => <option key={d} value={d}>{new Date(d + "T12:00:00").toLocaleDateString("ca-ES", { weekday: "short", day: "numeric", month: "short" })}</option>)}
        </select>
        {(filterPerson !== "all" || filterDay !== "all") && <button className="btn-ghost btn btn-sm" onClick={() => { setFilterPerson("all"); setFilterDay("all"); }}>{t.clearFilters}</button>}
        <div style={{ marginLeft: "auto", fontSize: 13, color: C.muted }}>{t.entries(filtered.length)}</div>
      </div>

      {open && (
        <div className="card shadow" style={{ marginBottom: 24, borderTop: `4px solid ${C.teal}` }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 12, marginBottom: 12 }}>
            <select className="select" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })}>
              {PARTICIPANTS.map(p => <option key={p.id}>{p.name}</option>)}
            </select>
            <input className="input" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
            <select className="select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
              {Object.entries(typeIcons).map(([k, v]) => <option key={k} value={k}>{v} {k}</option>)}
            </select>
          </div>
          <textarea className="input" rows="4" placeholder="Explica el teu dia, aprenentatge o experiència..." value={form.text} onChange={e => setForm({ ...form, text: e.target.value })} style={{ width: "100%", marginBottom: 10 }} />
          {form.type !== "text" && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                {/* Seleccionar des del dispositiu */}
                <label style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: C.erasmusLight, border: `1.5px solid ${C.erasmus}44`, borderRadius: 8, cursor: "pointer", fontSize: 13, color: C.erasmus, fontWeight: 600 }}>
                  📁 Seleccionar arxiu
                  <input type="file" accept={form.type === "photo" ? "image/*" : form.type === "video" ? "video/*" : "*/*"} style={{ display: "none" }}
                    onChange={e => {
                      const file = e.target.files[0];
                      if (!file) return;
                      if (file.size > 4 * 1024 * 1024) { alert("El fitxer és massa gran (màx. 4MB). Fes servir un URL extern."); return; }
                      const reader = new FileReader();
                      reader.onload = ev => setForm({ ...form, url: ev.target.result, fileName: file.name });
                      reader.readAsDataURL(file);
                    }} />
                </label>
                {/* Fer foto amb la càmera */}
                {(form.type === "photo" || form.type === "video") && (
                  <label style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "#F0FDF4", border: `1.5px solid ${C.green}44`, borderRadius: 8, cursor: "pointer", fontSize: 13, color: C.green, fontWeight: 600 }}>
                    📸 Fer foto/vídeo
                    <input type="file" accept={form.type === "photo" ? "image/*" : "video/*"} capture="environment" style={{ display: "none" }}
                      onChange={e => {
                        const file = e.target.files[0];
                        if (!file) return;
                        if (file.size > 4 * 1024 * 1024) { alert("El fitxer és massa gran (màx. 4MB)."); return; }
                        const reader = new FileReader();
                        reader.onload = ev => setForm({ ...form, url: ev.target.result, fileName: file.name });
                        reader.readAsDataURL(file);
                      }} />
                  </label>
                )}
                {/* O bé URL manual */}
                <span style={{ fontSize: 12, color: C.muted, alignSelf: "center" }}>o</span>
                <input className="input" placeholder="URL extern (https://...)" value={form.url?.startsWith("data:") ? "" : (form.url || "")} onChange={e => setForm({ ...form, url: e.target.value, fileName: "" })} style={{ flex: 1, minWidth: 180 }} />
              </div>
              {/* Previsualització */}
              {form.url?.startsWith("data:image") && (
                <div style={{ position: "relative", display: "inline-block" }}>
                  <img src={form.url} alt="preview" style={{ maxHeight: 160, maxWidth: "100%", borderRadius: 8, border: `1px solid ${C.border}` }} />
                  <button onClick={() => setForm({ ...form, url: "", fileName: "" })} style={{ position: "absolute", top: 4, right: 4, background: "rgba(0,0,0,0.5)", border: "none", color: "white", borderRadius: "50%", width: 22, height: 22, cursor: "pointer", fontSize: 12 }}>✕</button>
                </div>
              )}
              {form.fileName && !form.url?.startsWith("data:image") && (
                <div style={{ fontSize: 12, color: C.green, marginTop: 4 }}>✅ {form.fileName}</div>
              )}
            </div>
          )}
          {/* Public/private toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, padding: "10px 14px", background: form.isPublic ? "#F0FDF4" : "#F8FAFC", borderRadius: 8, border: `1px solid ${form.isPublic ? "#BBF7D0" : C.border}` }}>
            <span style={{ fontSize: 13, color: form.isPublic ? C.green : C.muted, flex: 1 }}>{form.isPublic ? t.visibleAll : t.visiblePrivate}</span>
            <button onClick={() => setForm({ ...form, isPublic: !form.isPublic })} style={{ background: form.isPublic ? C.green : C.muted, color: "white", border: "none", borderRadius: 6, padding: "5px 14px", cursor: "pointer", fontSize: 12, fontFamily: "DM Sans, sans-serif", fontWeight: 700 }}>
              {form.isPublic ? t.makePrivate : t.makePublic}
            </button>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn" onClick={add}>{editId ? t.save : t.publish}</button>
            <button className="btn btn-ghost" onClick={() => { setOpen(false); setEditId(null); }}>{t.cancel}</button>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gap: 14 }}>
        {filtered.length === 0 && <div className="card" style={{ textAlign: "center", padding: 56, color: C.light }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📖</div>
          <div>{t.emptyDiary}</div>
        </div>}
        {filtered.map(e => {
          const p = PARTICIPANTS.find(x => x.name === e.author) || PARTICIPANTS[0];
          const isPrivate = e.isPublic === false;
          return (
            <div key={e.id} className="card shadow" style={{ borderLeft: `4px solid ${p.color}`, opacity: isPrivate ? 0.9 : 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: `${p.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, border: `2px solid ${p.color}44` }}>{p.emoji}</div>
                <div>
                  <div style={{ fontWeight: 700, color: C.text }}>{e.author.split(" ")[0]}</div>
                  <div style={{ fontSize: 11, color: C.light }}>{fmtDate(e.date)} · {typeIcons[e.type]} {e.type}</div>
                </div>
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
                  {canWrite && (
                    <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 12, background: isPrivate ? "#F1F5F9" : "#DCFCE7", color: isPrivate ? C.muted : C.green, border: `1px solid ${isPrivate ? C.border : "#BBF7D0"}`, cursor: "pointer" }} onClick={() => togglePublic(e.id)}>
                      {isPrivate ? "🔒 Privat" : "👁️ Públic"}
                    </span>
                  )}
                  {canWrite && <button onClick={() => startEdit(e)} style={{ background: "none", border: "none", color: C.erasmus, cursor: "pointer", fontSize: 14 }}>✏️</button>}
                  {canWrite && <button onClick={() => setEntries(entries.filter(x => x.id !== e.id))} style={{ background: "none", border: "none", color: C.light, cursor: "pointer", fontSize: 16 }}>✕</button>}
                </div>
              </div>
              <div style={{ fontSize: 14, color: C.text, lineHeight: 1.7 }}>{e.text}</div>
              {e.url && <a href={e.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: 10, color: C.erasmus, fontSize: 13, fontWeight: 600 }}>🔗 Veure {e.type}</a>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── DOCUMENTS (PRIVATE) ────────────────────────────────────
function DocsTab({ docs, setDocs, t }) {
  const [form, setForm] = useState({ type: "ESTA", person: PARTICIPANTS[0].name, name: "", notes: "", url: "", status: "Pendent ⏳" });
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [filterPerson, setFilterPerson] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const docTypes = t.docTypes;
  const statusOpts = ["Pendent ⏳", "En tràmit 🔄", "Aprovat ✅", "Caducat ❌"];
  const statusColors = {
    "Pendent ⏳": { bg: "#F1F5F9", color: "#475569", border: "#CBD5E1" },
    "En tràmit 🔄": { bg: "#FEF9C3", color: "#854D0E", border: "#FDE68A" },
    "Aprovat ✅": { bg: "#DCFCE7", color: "#166534", border: "#BBF7D0" },
    "Caducat ❌": { bg: "#FEF2F2", color: "#991B1B", border: "#FECACA" },
  };

  const add = () => {
    if (!form.name.trim()) return;
    if (editId) {
      setDocs(docs.map(d => d.id === editId ? { ...d, ...form } : d));
      setEditId(null);
    } else {
      setDocs([...docs, { id: Date.now(), ...form }]);
    }
    setForm({ type: "ESTA", person: PARTICIPANTS[0].name, name: "", notes: "", url: "", status: "Pendent ⏳" });
    setOpen(false);
  };

  const startEdit = (doc) => { setForm({ ...doc }); setEditId(doc.id); setOpen(true); };

  const filtered = docs.filter(d =>
    (filterPerson === "all" || d.person === filterPerson) &&
    (filterType === "all" || d.type === filterType)
  );

  // Default ESTA entries if empty
  const defaultDocs = PARTICIPANTS.map((p, i) => ({
    id: 9000 + i, type: "ESTA", person: p.name,
    name: `ESTA — ${p.name.split(" ")[0]}`,
    notes: "Cost: $21/persona. URL oficial: https://esta.cbp.dhs.gov · Validesa: 2 anys. Passaport requerit.",
    url: "https://esta.cbp.dhs.gov", status: "Pendent ⏳",
  }));

  const allDocs = docs.length === 0 ? defaultDocs : docs;
  const filteredAll = allDocs.filter(d =>
    (filterPerson === "all" || d.person === filterPerson) &&
    (filterType === "all" || d.type === filterType)
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 12 }}>
        <div className="section-title" style={{ marginBottom: 0 }}>{t.docsTitle}</div>
        <button className="btn" onClick={() => { setOpen(!open); setEditId(null); setForm({ type: "ESTA", person: PARTICIPANTS[0].name, name: "", notes: "", url: "", status: "Pendent ⏳" }); }}>{t.addDoc}</button>
      </div>

      <div style={{ background: "#FFF7ED", border: "1px solid #FDBA74", borderRadius: 8, padding: "10px 16px", marginBottom: 20, fontSize: 13, color: "#92400E" }}>
        🔒 Aquesta pestanya és <strong>privada</strong>. Només la veuen els usuaris autoritzats per la Marissa.
      </div>

      {open && (
        <div className="card shadow" style={{ marginBottom: 24, borderTop: `4px solid #7C3AED` }}>
          <div style={{ fontWeight: 700, color: "#7C3AED", marginBottom: 12 }}>{editId ? t.edit : t.addDoc}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 4, fontWeight: 600 }}>{t.docType}</label>
              <select className="select" style={{ width: "100%" }} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                {docTypes.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 4, fontWeight: 600 }}>{t.docPerson}</label>
              <select className="select" style={{ width: "100%" }} value={form.person} onChange={e => setForm({ ...form, person: e.target.value })}>
                {PARTICIPANTS.map(p => <option key={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 4, fontWeight: 600 }}>Estat</label>
              <select className="select" style={{ width: "100%" }} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                {statusOpts.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 10 }}>
            <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 4, fontWeight: 600 }}>{t.docName}</label>
            <input className="input" placeholder="Ex: ESTA Marissa, Passaport Andrea..." value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 6, fontWeight: 600 }}>Arxiu o URL</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", background: C.erasmusLight, border: `1.5px solid ${C.erasmus}44`, borderRadius: 8, cursor: "pointer", fontSize: 12, color: C.erasmus, fontWeight: 600, whiteSpace: "nowrap" }}>
                📁 Seleccionar arxiu
                <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,image/*" style={{ display: "none" }}
                  onChange={e => {
                    const file = e.target.files[0];
                    if (!file) return;
                    if (file.size > 4 * 1024 * 1024) { alert("El fitxer és massa gran (màx. 4MB). Fes servir un URL extern."); return; }
                    const reader = new FileReader();
                    reader.onload = ev => setForm({ ...form, url: ev.target.result, fileName: file.name, name: form.name || file.name });
                    reader.readAsDataURL(file);
                  }} />
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", background: "#F0FDF4", border: `1.5px solid ${C.green}44`, borderRadius: 8, cursor: "pointer", fontSize: 12, color: C.green, fontWeight: 600, whiteSpace: "nowrap" }}>
                📸 Fer foto
                <input type="file" accept="image/*" capture="environment" style={{ display: "none" }}
                  onChange={e => {
                    const file = e.target.files[0];
                    if (!file) return;
                    if (file.size > 4 * 1024 * 1024) { alert("El fitxer és massa gran (màx. 4MB)."); return; }
                    const reader = new FileReader();
                    reader.onload = ev => setForm({ ...form, url: ev.target.result, fileName: file.name, name: form.name || file.name });
                    reader.readAsDataURL(file);
                  }} />
              </label>
              <input className="input" placeholder="o URL extern (https://...)" value={form.url?.startsWith("data:") ? "" : (form.url || "")} onChange={e => setForm({ ...form, url: e.target.value, fileName: "" })} style={{ flex: 1, minWidth: 160 }} />
            </div>
            {form.url?.startsWith("data:image") && (
              <div style={{ position: "relative", display: "inline-block", marginTop: 4 }}>
                <img src={form.url} alt="preview" style={{ maxHeight: 100, maxWidth: "100%", borderRadius: 6, border: `1px solid ${C.border}` }} />
                <button onClick={() => setForm({ ...form, url: "", fileName: "" })} style={{ position: "absolute", top: 2, right: 2, background: "rgba(0,0,0,0.5)", border: "none", color: "white", borderRadius: "50%", width: 20, height: 20, cursor: "pointer", fontSize: 11 }}>✕</button>
              </div>
            )}
            {form.fileName && !form.url?.startsWith("data:image") && (
              <div style={{ fontSize: 12, color: C.green, marginTop: 4 }}>✅ {form.fileName}</div>
            )}
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 4, fontWeight: 600 }}>{t.notes}</label>
            <textarea className="input" rows="3" style={{ width: "100%" }} placeholder="Núm. expedient, data caducitat, observacions..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn" onClick={add}>{editId ? t.save : t.addDoc}</button>
            <button className="btn btn-ghost" onClick={() => { setOpen(false); setEditId(null); }}>{t.cancel}</button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <select className="select" value={filterPerson} onChange={e => setFilterPerson(e.target.value)}>
          <option value="all">{t.all} — {t.person}</option>
          {PARTICIPANTS.map(p => <option key={p.id} value={p.name}>{p.emoji} {p.name.split(" ")[0]}</option>)}
        </select>
        <select className="select" value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="all">{t.allF} — {t.docType}</option>
          {docTypes.map(d => <option key={d}>{d}</option>)}
        </select>
      </div>

      {/* Per participant grid */}
      <div style={{ display: "grid", gap: 20 }}>
        {PARTICIPANTS.map(p => {
          const pDocs = filteredAll.filter(d => d.person === p.name);
          if (filterPerson !== "all" && filterPerson !== p.name) return null;
          if (filterType !== "all" && pDocs.length === 0) return null;
          return (
            <div key={p.id}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 22 }}>{p.emoji}</span>
                <span style={{ fontWeight: 700, color: C.erasmus }}>{p.name}</span>
                <span style={{ fontSize: 12, color: C.muted }}>— {p.role.split(" / ")[0]}</span>
              </div>
              {pDocs.length === 0 ? (
                <div style={{ fontSize: 13, color: C.light, padding: "12px 16px", background: C.bg, borderRadius: 8 }}>Cap document registrat</div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
                  {pDocs.map(doc => {
                    const sc = statusColors[doc.status] || statusColors["Pendent ⏳"];
                    return (
                      <div key={doc.id} className="card shadow" style={{ borderLeft: `4px solid ${p.color}` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                          <div>
                            <span className="badge" style={{ background: "#EDE9FE", color: "#4C1D95", borderColor: "#C4B5FD", marginRight: 6 }}>{doc.type}</span>
                            <span className="badge" style={{ background: sc.bg, color: sc.color, borderColor: sc.border }}>{doc.status}</span>
                          </div>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button onClick={() => startEdit(doc)} style={{ background: "none", border: "none", color: C.erasmus, cursor: "pointer", fontSize: 14 }}>✏️</button>
                            <button onClick={() => setDocs((docs.length === 0 ? defaultDocs : docs).filter(x => x.id !== doc.id))} style={{ background: "none", border: "none", color: C.light, cursor: "pointer", fontSize: 14 }}>✕</button>
                          </div>
                        </div>
                        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{doc.name}</div>
                        {doc.notes && <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6, marginBottom: 8 }}>{doc.notes}</div>}
                        {doc.url && <a href={doc.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: C.erasmus, fontWeight: 600 }}>🔗 Obrir enllaç</a>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── EVAL ────────────────────────────────────────────────────
function EvalTab({ canWrite }) {
  const [active, setActive] = useState(null);
  const [answers, setAnswers] = useState({});
  const [openText, setOpenText] = useState("");
  const [done, setDone] = useState(false);
  const [allResults, setAllResults] = useState({});

  useEffect(() => {
    const load = async () => { try { const r = await window.storage.get("sf2-eval", true); if (r) setAllResults(JSON.parse(r.value)); } catch (e) {} };
    load();
  }, []);

  const questions = [
    { id: "q1", text: "He assolit els objectius d'aprenentatge del meu Learning Agreement", comp: "Literacy" },
    { id: "q2", text: "He millorat la meva competència en anglès professional", comp: "Multilingual" },
    { id: "q3", text: "He après eines i plataformes digitals noves", comp: "Digital" },
    { id: "q4", text: "He demostrat autonomia i resolució de problemes", comp: "Personal/Social" },
    { id: "q5", text: "He respectat les normes professionals i l'ètica", comp: "Citizenship" },
    { id: "q6", text: "He identificat oportunitats d'innovació i millora", comp: "Entrepreneurship" },
    { id: "q7", text: "He aprofundit en la comprensió de la cultura dels EUA", comp: "Cultural Awareness" },
    { id: "q8", text: "La mobilitat ha superat les meves expectatives generals", comp: "General" },
    { id: "q9", text: "Recomanaria aquesta mobilitat a companys/es", comp: "General" },
    { id: "q10", text: "Els aprenentatges seran transferibles a la meva institució", comp: "Impact" },
  ];

  const kpis = [
    { icon: "🤝", title: "Partenariats establerts", target: "1+", current: "SFUSD ✅ + La Cocina 🔄" },
    { icon: "📄", title: "Learning Agreements", target: "5/5", current: "5 ✅" },
    { icon: "🎓", title: "Competències treballades", target: "7/7", current: "7 ✅" },
    { icon: "📸", title: "Entrades al diari", target: "≥10", current: `${0} registrades` },
    { icon: "🌐", title: "Activitats completades", target: "4/4", current: "SFUSD, La Cocina, centres, competició" },
    { icon: "⭐", title: "Satisfacció participants", target: "≥4/5", current: `${Object.keys(allResults).length}/5 avaluats` },
  ];

  const submit = async () => {
    if (Object.keys(answers).length < questions.length) { alert("Respon totes les preguntes."); return; }
    const updated = { ...allResults, [active]: { answers, openText, date: new Date().toISOString() } };
    setAllResults(updated);
    try { await window.storage.set("sf2-eval", JSON.stringify(updated), true); } catch (e) {}
    setDone(true);
    alert(`✅ Avaluació de ${active.split(" ")[0]} guardada!\nEn una versió amb backend, s'enviaria automàticament a mgar2373@xtec.cat`);
  };

  return (
    <div>
      <div className="section-title">Avaluació del Projecte</div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 14, marginBottom: 28 }}>
        {kpis.map(k => (
          <div key={k.title} className="card shadow" style={{ borderTop: `3px solid ${C.teal}` }}>
            <div style={{ display: "flex", gap: 12 }}>
              <span style={{ fontSize: 24, flexShrink: 0 }}>{k.icon}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4, color: C.text }}>{k.title}</div>
                <span className="badge" style={{ background: "#CCFBF1", color: "#0F766E", borderColor: "#99F6E4", display: "block", marginBottom: 4 }}>{k.target}</span>
                <div style={{ fontSize: 11, color: C.muted }}>{k.current}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Completed */}
      {Object.keys(allResults).length > 0 && (
        <div className="card-sm" style={{ marginBottom: 20, background: "#F0FDF4", border: `1px solid #BBF7D0` }}>
          <div style={{ fontWeight: 700, color: C.green, marginBottom: 8 }}>Autoavaluacions recollides ({Object.keys(allResults).length}/5)</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {PARTICIPANTS.map(p => <span key={p.id} className="badge" style={{ background: allResults[p.name] ? "#DCFCE7" : "#F1F5F9", color: allResults[p.name] ? C.green : C.light, borderColor: allResults[p.name] ? "#BBF7D0" : C.border, padding: "5px 14px" }}>{p.emoji} {p.name.split(" ")[0]} {allResults[p.name] ? "✓" : "—"}</span>)}
          </div>
        </div>
      )}

      {/* Self-eval selector */}
      {!active && !done && (
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 12, color: C.erasmus }}>Autoavaluació individual</div>
          <div style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>Selecciona el teu nom per iniciar l'avaluació basada en els Learning Agreements:</div>
          <div className="grid-5">
            {PARTICIPANTS.map(p => (
              <button key={p.id} onClick={() => { setActive(p.name); setAnswers({}); setOpenText(""); setDone(false); }} className="card hover-lift" style={{ border: `2px solid ${allResults[p.name] ? C.green : C.border}`, cursor: "pointer", textAlign: "center", padding: "20px 10px", background: allResults[p.name] ? "#F0FDF4" : "white" }}>
                <div style={{ fontSize: 38, marginBottom: 8 }}>{p.emoji}</div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{p.name.split(" ")[0]}</div>
                <div style={{ fontSize: 11, color: allResults[p.name] ? C.green : C.muted, marginTop: 4 }}>{allResults[p.name] ? "✅ Feta" : "Iniciar →"}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {active && !done && (
        <div className="card shadow" style={{ borderTop: `4px solid ${C.erasmus}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ fontFamily: "DM Serif Display", fontSize: 22, color: C.erasmus }}>Autoavaluació — {active}</div>
            <button onClick={() => setActive(null)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 18 }}>✕</button>
          </div>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 20 }}>Valora de l'1 al 5 (1 = Gens d'acord · 5 = Totalment d'acord)</div>
          {questions.map((q, i) => (
            <div key={q.id} style={{ marginBottom: 18, padding: 16, background: C.bg, borderRadius: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                <div>
                  <span className="badge" style={{ background: C.erasmusLight, color: C.erasmus, borderColor: `${C.erasmus}33`, marginBottom: 6, display: "inline-block" }}>{q.comp}</span>
                  <div style={{ fontSize: 14, color: C.text }}>{i + 1}. {q.text}</div>
                </div>
                <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                  {[1, 2, 3, 4, 5].map(v => (
                    <span key={v} onClick={() => setAnswers({ ...answers, [q.id]: v })} style={{ cursor: "pointer", fontSize: 24, color: answers[q.id] >= v ? "#F59E0B" : "#D1D5DB", transition: "transform 0.1s", display: "inline-block" }}>★</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
          <div style={{ marginTop: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 700, display: "block", marginBottom: 8 }}>Reflexió personal i comentaris:</label>
            <textarea className="input" rows="4" style={{ width: "100%" }} placeholder="Aprenentatges destacats, dificultats trobades, impacte esperat..." value={openText} onChange={e => setOpenText(e.target.value)} />
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 20, alignItems: "center" }}>
            <button className="btn" onClick={submit}>📤 Enviar avaluació</button>
            <div style={{ fontSize: 12, color: C.muted }}>S'enviarà a: mgar2373@xtec.cat</div>
          </div>
        </div>
      )}

      {done && (
        <div className="card shadow" style={{ textAlign: "center", padding: 48, borderTop: `4px solid ${C.green}` }}>
          <div style={{ fontSize: 64, marginBottom: 12 }}>🎉</div>
          <div style={{ fontFamily: "DM Serif Display", fontSize: 28, color: C.green, marginBottom: 8 }}>Avaluació completada!</div>
          <div style={{ color: C.muted, marginBottom: 20 }}>Gràcies, {active?.split(" ")[0]}. La teva avaluació ha estat registrada.</div>
          <button className="btn btn-ghost" onClick={() => { setActive(null); setDone(false); }}>← Tornar</button>
        </div>
      )}
    </div>
  );
}
