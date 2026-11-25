"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  Check,
  Clock3,
  Copy,
  Gauge,
  MessageCircle,
  RotateCcw,
  Send,
  UsersRound,
  Wallet,
  X,
} from "lucide-react";
import { ui, type Locale } from "@/content/ui";

/* ------------------------------------------------------------------ */
/* Types & constantes                                                  */
/* ------------------------------------------------------------------ */

type GuideIntent =
  | "estimate"
  | "value"
  | "pilot"
  | "workflows"
  | "reliability"
  | "price"
  | "privacy"
  | "assistant"
  | "contact"
  | "fallback";

type GuideMessage = {
  id: number;
  role: "user" | "assistant";
  text: string;
  followUps?: GuideIntent[];
};

type Scenario = {
  organization: number;
  pilot: number;
  hours: number;
  share: number;
  cost: number;
};

const WORKED_WEEKS_PER_YEAR = 46;
const HOURS_PER_FTE = 40;

const DEFAULT_SCENARIO: Scenario = {
  organization: 24,
  pilot: 5,
  hours: 4,
  share: 30,
  cost: 3000,
};

const PRESETS: Record<"small" | "team" | "large", Scenario> = {
  small: { organization: 8, pilot: 3, hours: 3, share: 25, cost: 2500 },
  team: DEFAULT_SCENARIO,
  large: { organization: 80, pilot: 15, hours: 5, share: 35, cost: 3500 },
};

const guideIntents: GuideIntent[] = [
  "estimate",
  "value",
  "pilot",
  "workflows",
  "reliability",
  "price",
  "privacy",
  "assistant",
  "contact",
];

const followUpMap: Record<GuideIntent, GuideIntent[]> = {
  estimate: ["value", "pilot", "reliability"],
  value: ["pilot", "price", "contact"],
  pilot: ["workflows", "price", "contact"],
  workflows: ["pilot", "assistant", "privacy"],
  reliability: ["estimate", "pilot", "contact"],
  price: ["pilot", "value", "contact"],
  privacy: ["assistant", "reliability", "contact"],
  assistant: ["workflows", "privacy", "pilot"],
  contact: ["estimate", "workflows", "pilot"],
  fallback: ["estimate", "workflows", "pilot"],
};

const guideKeywords: Record<Locale, Record<GuideIntent, string[]>> = {
  fr: {
    estimate: ["calcul", "estimation", "projection", "resultat", "heure", "temps", "gain", "signifie", "optimisable", "part"],
    value: ["fcfa", "franc", "valeur", "argent", "rentab", "roi", "retour", "economie", "economies"],
    pilot: ["pilote", "commencer", "demarrer", "etape", "deployer", "priorite"],
    workflows: ["process", "tache", "automatis", "exemple", "usage", "cas d usage", "document", "kyc", "alerte", "contrat", "veille", "reporting", "relance"],
    reliability: ["garanti", "garantie", "promesse", "fiable", "reel", "risque", "exact"],
    price: ["prix", "cout", "tarif", "budget", "combien coute", "combien ca coute", "combien cela coute"],
    privacy: ["confidentialite", "donnee", "stocke", "enregistre", "envoye", "partage", "serveur"],
    assistant: ["ia", "intelligence artificielle", "chatbot", "assistant"],
    contact: ["contact", "rendez vous", "consultant", "parler", "discuter"],
    fallback: [],
  },
  en: {
    estimate: ["calculate", "estimate", "projection", "result", "hours", "time", "saving", "mean", "optimisable", "optimizable", "percentage", "share"],
    value: ["fcfa", "franc", "value", "money", "worth", "roi", "return", "profitable"],
    pilot: ["pilot", "start", "begin", "step", "rollout", "prioritise", "prioritize"],
    workflows: ["process", "task", "automate", "example", "use case", "document", "kyc", "alert", "contract", "monitoring", "report", "follow up"],
    reliability: ["guarantee", "promise", "reliable", "actual", "risk", "accurate"],
    price: ["price", "cost", "pricing", "budget", "how much"],
    privacy: ["privacy", "data", "stored", "saved", "sent", "shared", "server"],
    assistant: ["ai", "artificial intelligence", "chatbot", "assistant"],
    contact: ["contact", "meeting", "consultant", "speak", "discuss"],
    fallback: [],
  },
};

/* Textes ajoutés par cette version (le reste continue de venir de ui.ts) */
const extra = {
  fr: {
    presetsLabel: "Point de départ",
    presets: { small: "Petite équipe", team: "Cabinet", large: "Grande structure" },
    costLabel: "Valeur d’une heure",
    costHint: "Coût horaire moyen chargé de vos équipes",
    hero: "Temps récupérable chaque semaine",
    heroSub: "si toute l’équipe est concernée",
    month: "par mois",
    year: "par an",
    fte: "temps plein",
    valueLabel: "Valeur annuelle du temps récupéré",
    valuePilot: "dont {value} dès le pilote",
    valueEmpty: "Indiquez la valeur d’une heure pour obtenir un équivalent en FCFA.",
    pilot: "Pilote",
    team: "Toute l’équipe",
    copy: "Copier le résumé",
    copied: "Résumé copié",
    reset: "Réinitialiser",
    assumptions: "Hypothèses : 46 semaines travaillées par an, 40 h par équivalent temps plein.",
    summary:
      "Simulation SARC Consulting : {org} personnes, pilote sur {pilot}. {hours} h par semaine et par personne, dont {share} % optimisables. Pilote : {pilotHours} h par semaine. Équipe entière : {orgHours} h par semaine, soit {year} h par an ({fte} équivalents temps plein).",
    summaryValue: " Valeur annuelle estimée : {value} FCFA.",
    chatClear: "Nouvelle conversation",
    chatTyping: "Le guide rédige une réponse",
    chatFollowUp: "Pour aller plus loin",
    topics: {
      estimate: "Comprendre mon résultat",
      value: "Combien cela représente-t-il ?",
      pilot: "Démarrer un pilote",
      workflows: "Exemples d’automatisation",
      reliability: "Quelle fiabilité ?",
      price: "Quel budget prévoir ?",
      privacy: "Que deviennent mes données ?",
      assistant: "Quel rôle pour l’IA ?",
      contact: "Parler à un consultant",
      fallback: "",
    } as Record<GuideIntent, string>,
    valueAnswer:
      "En valorisant une heure à {cost} FCFA, le pilote représente environ {pilot} FCFA par an et l’équipe entière environ {org} FCFA. C’est un temps libéré, pas une économie garantie : tout dépend de ce que vos équipes en font.",
    valueEmptyAnswer:
      "Réglez « Valeur d’une heure » dans le simulateur : j’en déduirai la valeur annuelle du temps récupéré, pour le pilote comme pour toute l’équipe.",
  },
  en: {
    presetsLabel: "Starting point",
    presets: { small: "Small team", team: "Firm", large: "Large organisation" },
    costLabel: "Value of one hour",
    costHint: "Average loaded hourly cost of your people",
    hero: "Time you can recover each week",
    heroSub: "if the whole team is involved",
    month: "per month",
    year: "per year",
    fte: "full-time",
    valueLabel: "Yearly value of the time recovered",
    valuePilot: "of which {value} from the pilot",
    valueEmpty: "Set the value of one hour to see an equivalent in FCFA.",
    pilot: "Pilot",
    team: "Whole team",
    copy: "Copy summary",
    copied: "Summary copied",
    reset: "Reset",
    assumptions: "Assumptions: 46 working weeks per year, 40 hours per full-time equivalent.",
    summary:
      "SARC Consulting simulation: {org} people, pilot with {pilot}. {hours} h per week per person, {share}% of which can be optimised. Pilot: {pilotHours} h per week. Whole team: {orgHours} h per week, or {year} h per year ({fte} full-time equivalents).",
    summaryValue: " Estimated yearly value: {value} FCFA.",
    chatClear: "New conversation",
    chatTyping: "The guide is writing a reply",
    chatFollowUp: "Keep exploring",
    topics: {
      estimate: "Understand my result",
      value: "What does that amount to?",
      pilot: "Start a pilot",
      workflows: "Automation examples",
      reliability: "How reliable is it?",
      price: "What budget to expect?",
      privacy: "What happens to my data?",
      assistant: "What is AI’s role?",
      contact: "Speak to a consultant",
      fallback: "",
    } as Record<GuideIntent, string>,
    valueAnswer:
      "Valuing one hour at {cost} FCFA, the pilot is worth about {pilot} FCFA a year and the whole team about {org} FCFA. This is time freed up, not a guaranteed saving: it depends on what your people do with it.",
    valueEmptyAnswer:
      "Set “Value of one hour” in the simulator and I will work out the yearly value of the time recovered, for the pilot and for the whole team.",
  },
};

/* ------------------------------------------------------------------ */
/* Utilitaires                                                         */
/* ------------------------------------------------------------------ */

function normalizeQuestion(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function matchesKeyword(question: string, keyword: string) {
  const normalizedKeyword = normalizeQuestion(keyword);
  if (normalizedKeyword.includes(" ")) {
    return ` ${question} `.includes(` ${normalizedKeyword} `);
  }

  return question.split(" ").some((word) => (
    word === normalizedKeyword
    || (normalizedKeyword.length >= 4 && word.startsWith(normalizedKeyword))
  ));
}

function classifyQuestion(question: string, locale: Locale): GuideIntent {
  const normalized = normalizeQuestion(question);
  let bestIntent: GuideIntent = "fallback";
  let bestScore = 0;

  for (const intent of guideIntents) {
    const score = guideKeywords[locale][intent].reduce((total, keyword) => {
      return matchesKeyword(normalized, keyword)
        ? total + normalizeQuestion(keyword).split(" ").length
        : total;
    }, 0);

    if (score > bestScore) {
      bestIntent = intent;
      bestScore = score;
    }
  }

  return bestIntent;
}

function fill(template: string, values: Record<string, string>) {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, value),
    template,
  );
}

/** Anime un nombre vers sa nouvelle valeur (désactivé si mouvement réduit). */
function useAnimatedNumber(target: number) {
  const [value, setValue] = useState(target);
  const current = useRef(target);

  useEffect(() => {
    const reduce = typeof window !== "undefined"
      && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      current.current = target;
      setValue(target);
      return;
    }

    const from = current.current;
    const start = performance.now();
    const duration = 450;
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = from + (target - from) * eased;
      current.current = next;
      setValue(next);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return value;
}

/* ------------------------------------------------------------------ */
/* Curseur                                                             */
/* ------------------------------------------------------------------ */

type RangeFieldProps = {
  id: string;
  label: string;
  hint: string;
  value: number;
  displayValue: string;
  min: number;
  max: number;
  step: number;
  minLabel?: string;
  maxLabel?: string;
  icon: typeof Building2;
  onChange: (value: number) => void;
};

function RangeField({
  id,
  label,
  hint,
  value,
  displayValue,
  min,
  max,
  step,
  minLabel,
  maxLabel,
  icon: Icon,
  onChange,
}: RangeFieldProps) {
  const percent = max === min ? 100 : ((value - min) / (max - min)) * 100;

  return (
    <div className="ai-savings-field">
      <div className="ai-savings-field-heading">
        <span className="ai-savings-field-icon" aria-hidden="true">
          <Icon size={17} strokeWidth={1.6} />
        </span>
        <span className="ai-savings-field-copy">
          <label htmlFor={id}>{label}</label>
          <small>{hint}</small>
        </span>
        <output htmlFor={id}>{displayValue}</output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        style={{ "--fill": `${percent}%` } as CSSProperties}
        aria-valuetext={displayValue}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <div className="ai-savings-range-scale" aria-hidden="true">
        <span>{minLabel ?? min}</span>
        <span>{maxLabel ?? max}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Composant principal                                                 */
/* ------------------------------------------------------------------ */

export default function TimeSavingsSimulator({ locale }: { locale: Locale }) {
  const copy = ui[locale].timeSavingsSimulator;
  const more = extra[locale];
  const assistantCopy = copy.assistant;
  const contactPath = locale === "en" ? "/en/contact" : "/contact";

  const [scenario, setScenario] = useState<Scenario>(DEFAULT_SCENARIO);
  const [copied, setCopied] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<GuideMessage[]>([]);
  const [pending, setPending] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const messageListRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const replyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messageId = useRef(0);

  const { organization, pilot, hours, share, cost } = scenario;
  const update = (patch: Partial<Scenario>) => setScenario((current) => ({ ...current, ...patch }));

  /* Formats */
  const numberLocale = locale === "en" ? "en-GB" : "fr-FR";
  const numberFormat = new Intl.NumberFormat(numberLocale, { maximumFractionDigits: 1 });
  const integerFormat = new Intl.NumberFormat(numberLocale, { maximumFractionDigits: 0 });
  const formatMoney = (amount: number) => (
    amount >= 1_000_000
      ? `${numberFormat.format(amount / 1_000_000)} M`
      : integerFormat.format(Math.round(amount))
  );

  /* Calculs */
  const potentialPerPerson = hours * (share / 100);
  const pilotHours = pilot * potentialPerPerson;
  const organizationHours = organization * potentialPerPerson;
  const additionalHours = Math.max(organizationHours - pilotHours, 0);
  const monthlyHours = (organizationHours * WORKED_WEEKS_PER_YEAR) / 12;
  const yearlyHours = organizationHours * WORKED_WEEKS_PER_YEAR;
  const fullTimeEquivalents = organizationHours / HOURS_PER_FTE;
  const pilotYearValue = pilotHours * WORKED_WEEKS_PER_YEAR * cost;
  const organizationYearValue = yearlyHours * cost;
  const hasValue = cost > 0 && organizationYearValue > 0;

  const animatedOrganization = useAnimatedNumber(organizationHours);
  const animatedPilot = useAnimatedNumber(pilotHours);
  const animatedValue = useAnimatedNumber(organizationYearValue);
  const animatedPilotValue = useAnimatedNumber(pilotYearValue);

  const activePreset = (Object.keys(PRESETS) as Array<keyof typeof PRESETS>).find((key) => {
    const preset = PRESETS[key];
    return (Object.keys(preset) as Array<keyof Scenario>).every((field) => preset[field] === scenario[field]);
  });

  /* Résumé partageable (aussi annoncé aux lecteurs d’écran) */
  const summary = fill(more.summary, {
    org: String(organization),
    pilot: String(pilot),
    hours: numberFormat.format(hours),
    share: String(share),
    pilotHours: numberFormat.format(pilotHours),
    orgHours: numberFormat.format(organizationHours),
    year: integerFormat.format(yearlyHours),
    fte: numberFormat.format(fullTimeEquivalents),
  }) + (hasValue ? fill(more.summaryValue, { value: formatMoney(organizationYearValue) }) : "");

  useEffect(() => {
    const timer = setTimeout(() => setAnnouncement(summary), 700);
    return () => clearTimeout(timer);
  }, [summary]);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2200);
    return () => clearTimeout(timer);
  }, [copied]);

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  /* Chat */
  useEffect(() => {
    const messageList = messageListRef.current;
    if (assistantOpen && messageList) {
      messageList.scrollTop = messageList.scrollHeight;
    }
  }, [assistantOpen, messages, pending]);

  useEffect(() => {
    if (assistantOpen) inputRef.current?.focus();
  }, [assistantOpen]);

  useEffect(() => () => {
    if (replyTimer.current) clearTimeout(replyTimer.current);
  }, []);

  const answerFor = (intent: GuideIntent) => {
    if (intent === "estimate") {
      return assistantCopy.responses.estimate
        .replace("{pilot}", numberFormat.format(pilotHours))
        .replace("{organization}", numberFormat.format(organizationHours))
        .replace("{additional}", numberFormat.format(additionalHours));
    }

    if (intent === "value") {
      return hasValue
        ? fill(more.valueAnswer, {
          cost: integerFormat.format(cost),
          pilot: formatMoney(pilotYearValue),
          org: formatMoney(organizationYearValue),
        })
        : more.valueEmptyAnswer;
    }

    return assistantCopy.responses[intent];
  };

  const sendQuestion = (submittedQuestion: string, forcedIntent?: GuideIntent) => {
    const trimmedQuestion = submittedQuestion.trim();
    if (!trimmedQuestion || pending) return;

    const intent = forcedIntent ?? classifyQuestion(trimmedQuestion, locale);
    const userId = messageId.current++;
    const assistantId = messageId.current++;

    setMessages((current) => [...current, { id: userId, role: "user", text: trimmedQuestion }]);
    setQuestion("");
    setPending(true);

    replyTimer.current = setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: assistantId,
          role: "assistant",
          text: answerFor(intent),
          followUps: followUpMap[intent],
        },
      ]);
      setPending(false);
    }, 450);
  };

  const submitQuestion = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendQuestion(question);
  };

  const closeAssistant = () => {
    setAssistantOpen(false);
    launcherRef.current?.focus();
  };

  const onPanelKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      closeAssistant();
    }
  };

  const clearConversation = () => {
    if (replyTimer.current) clearTimeout(replyTimer.current);
    setPending(false);
    setMessages([]);
    inputRef.current?.focus();
  };

  const starterPrompts: Array<{ intent: GuideIntent; label: string }> = [
    { intent: "estimate", label: assistantCopy.askEstimate },
    { intent: "pilot", label: assistantCopy.askPilot },
    { intent: "workflows", label: assistantCopy.askWorkflows },
    { intent: "assistant", label: assistantCopy.askAssistant },
  ];

  const lastAssistantId = [...messages].reverse().find((message) => message.role === "assistant")?.id;
  const scaleBase = organizationHours || 1;

  return (
    <section
      className="section ai-savings-section"
      id="time-savings-simulator"
      aria-labelledby="time-savings-heading"
    >
      <div className="container">
        <div className="ai-savings-panel">
          {/* ----------------------------- Réglages ----------------------------- */}
          <div className="ai-savings-configuration">
            <div className="ai-savings-intro">
              <span className="eyebrow">{copy.eyebrow}</span>
              <h2 className="serif" id="time-savings-heading">{copy.title}</h2>
              <p>{copy.description}</p>
            </div>

            <div className="ai-savings-presets" role="group" aria-label={more.presetsLabel}>
              {(Object.keys(PRESETS) as Array<keyof typeof PRESETS>).map((key) => (
                <button
                  type="button"
                  key={key}
                  className={activePreset === key ? "is-active" : undefined}
                  aria-pressed={activePreset === key}
                  onClick={() => setScenario(PRESETS[key])}
                >
                  {more.presets[key]}
                </button>
              ))}
            </div>

            <div className="ai-savings-fields">
              <RangeField
                id="organization-size"
                label={copy.organizationLabel}
                hint={copy.organizationHint}
                value={organization}
                displayValue={`${organization} ${organization === 1 ? copy.personSingular : copy.personPlural}`}
                min={1}
                max={100}
                step={1}
                icon={Building2}
                onChange={(value) => update({ organization: value, pilot: Math.min(pilot, value) })}
              />
              <RangeField
                id="pilot-size"
                label={copy.pilotLabel}
                hint={copy.pilotHint}
                value={pilot}
                displayValue={`${pilot} ${pilot === 1 ? copy.personSingular : copy.personPlural}`}
                min={1}
                max={organization}
                step={1}
                icon={UsersRound}
                onChange={(value) => update({ pilot: value })}
              />
              <RangeField
                id="weekly-hours"
                label={copy.weeklyHoursLabel}
                hint={copy.weeklyHoursHint}
                value={hours}
                displayValue={`${numberFormat.format(hours)} h`}
                min={0}
                max={20}
                step={0.5}
                minLabel="0 h"
                maxLabel="20 h"
                icon={Clock3}
                onChange={(value) => update({ hours: value })}
              />
              <RangeField
                id="optimizable-share"
                label={copy.optimizableShareLabel}
                hint={copy.optimizableShareHint}
                value={share}
                displayValue={`${share} %`}
                min={0}
                max={100}
                step={5}
                minLabel="0 %"
                maxLabel="100 %"
                icon={Gauge}
                onChange={(value) => update({ share: value })}
              />
              <RangeField
                id="hourly-cost"
                label={more.costLabel}
                hint={more.costHint}
                value={cost}
                displayValue={cost === 0 ? "—" : `${integerFormat.format(cost)} FCFA`}
                min={0}
                max={20000}
                step={500}
                minLabel="0"
                maxLabel="20 000"
                icon={Wallet}
                onChange={(value) => update({ cost: value })}
              />
            </div>

            <div className="ai-savings-footer">
              <p className="ai-savings-privacy">{copy.privacyNote}</p>
              <button
                type="button"
                className="ai-savings-reset"
                onClick={() => setScenario(DEFAULT_SCENARIO)}
              >
                <RotateCcw size={14} aria-hidden="true" />
                {more.reset}
              </button>
            </div>
          </div>

          {/* ----------------------------- Résultats ---------------------------- */}
          <aside className="ai-savings-results" aria-label={copy.resultsLabel}>
            <p className="ai-savings-results-kicker">{copy.resultsEyebrow}</p>

            <div className="ai-savings-hero" aria-hidden="true">
              <span className="ai-savings-hero-label">{more.hero}</span>
              <output>
                {numberFormat.format(Math.round(animatedOrganization * 10) / 10)}
                <small> h</small>
              </output>
              <span className="ai-savings-hero-sub">{more.heroSub}</span>
            </div>

            <div className="ai-savings-metrics" aria-hidden="true">
              <div className="ai-savings-metric">
                <strong>{integerFormat.format(Math.round(monthlyHours))} h</strong>
                <span>{more.month}</span>
              </div>
              <div className="ai-savings-metric">
                <strong>{integerFormat.format(Math.round(yearlyHours))} h</strong>
                <span>{more.year}</span>
              </div>
              <div className="ai-savings-metric">
                <strong>{numberFormat.format(fullTimeEquivalents)}</strong>
                <span>{more.fte}</span>
              </div>
            </div>

            <div className="ai-savings-value" aria-hidden="true">
              <span className="ai-savings-value-label">{more.valueLabel}</span>
              {hasValue ? (
                <>
                  <strong>{formatMoney(animatedValue)} <small>FCFA</small></strong>
                  <span className="ai-savings-value-note">
                    {fill(more.valuePilot, { value: `${formatMoney(animatedPilotValue)} FCFA` })}
                  </span>
                </>
              ) : (
                <span className="ai-savings-value-empty">{more.valueEmpty}</span>
              )}
            </div>

            <div className="ai-savings-scale" aria-hidden="true">
              <div className="ai-savings-scale-row">
                <span>{more.pilot} · {pilot} / {organization}</span>
                <span>{numberFormat.format(animatedPilot)} h</span>
              </div>
              <div className="ai-savings-scale-track">
                <span style={{ width: `${Math.min((pilotHours / scaleBase) * 100, 100)}%` }} />
              </div>
              <div className="ai-savings-scale-row">
                <span>{more.team}</span>
                <span>{numberFormat.format(organizationHours)} h</span>
              </div>
              <div className="ai-savings-scale-track">
                <span className="ai-savings-scale-full" />
              </div>
            </div>

            <p className="ai-savings-potential">
              <strong>+{numberFormat.format(additionalHours)} h</strong>
              <span>{copy.additionalPotential}</span>
            </p>

            <div className="ai-savings-actions">
              <Link className="button ai-savings-cta" href={contactPath}>
                {copy.cta}
                <ArrowUpRight className="action-icon" size={14} aria-hidden="true" />
              </Link>
              <button type="button" className="ai-savings-ghost" onClick={copySummary}>
                {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
                {copied ? more.copied : more.copy}
              </button>
            </div>

            <p className="ai-savings-assumptions">{more.assumptions}</p>
            <p className="ai-guide-sr-only" role="status" aria-live="polite">{announcement}</p>
          </aside>
        </div>

        <p className="ai-savings-disclaimer">{copy.disclaimer}</p>

        {/* --------------------------------- Chat --------------------------------- */}
        <div className="ai-guide-widget">
          <button
            ref={launcherRef}
            className="ai-guide-launch"
            type="button"
            aria-expanded={assistantOpen}
            aria-controls="ai-guide-panel"
            onClick={() => (assistantOpen ? closeAssistant() : setAssistantOpen(true))}
          >
            {assistantOpen ? <X size={17} aria-hidden="true" /> : <MessageCircle size={17} aria-hidden="true" />}
            {assistantOpen ? assistantCopy.close : assistantCopy.open}
          </button>

          {assistantOpen && (
            <section
              className="ai-guide-panel"
              id="ai-guide-panel"
              aria-label={assistantCopy.title}
              onKeyDown={onPanelKeyDown}
            >
              <header className="ai-guide-header">
                <div>
                  <span><i aria-hidden="true" />{assistantCopy.label}</span>
                  <h2>{assistantCopy.title}</h2>
                </div>
                <div className="ai-guide-header-actions">
                  {messages.length > 0 && (
                    <button type="button" aria-label={more.chatClear} title={more.chatClear} onClick={clearConversation}>
                      <RotateCcw size={16} aria-hidden="true" />
                    </button>
                  )}
                  <button type="button" aria-label={assistantCopy.close} onClick={closeAssistant}>
                    <X size={18} aria-hidden="true" />
                  </button>
                </div>
              </header>

              <p className="ai-guide-disclosure">{assistantCopy.disclosure}</p>

              <div
                className="ai-guide-messages"
                ref={messageListRef}
                role="log"
                aria-live="polite"
                aria-relevant="additions"
              >
                <p className="ai-guide-message ai-guide-message-assistant">{assistantCopy.greeting}</p>

                {messages.map((message) => (
                  <div className="ai-guide-turn" key={message.id}>
                    <p className={`ai-guide-message ai-guide-message-${message.role}`}>{message.text}</p>
                    {message.role === "assistant" && message.id === lastAssistantId && !pending && message.followUps && (
                      <div className="ai-guide-followups" aria-label={more.chatFollowUp}>
                        {message.followUps.map((intent) => (
                          <button
                            type="button"
                            key={intent}
                            onClick={() => sendQuestion(more.topics[intent], intent)}
                          >
                            {more.topics[intent]}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {pending && (
                  <p
                    className="ai-guide-message ai-guide-message-assistant ai-guide-typing"
                    role="status"
                    aria-label={more.chatTyping}
                  >
                    <i /><i /><i />
                  </p>
                )}
              </div>

              {messages.length === 0 && (
                <div className="ai-guide-prompts" aria-label={assistantCopy.suggestionsLabel}>
                  {starterPrompts.map(({ intent, label }) => (
                    <button type="button" key={intent} onClick={() => sendQuestion(label, intent)}>
                      {label}
                    </button>
                  ))}
                </div>
              )}

              <form className="ai-guide-form" onSubmit={submitQuestion}>
                <label className="ai-guide-sr-only" htmlFor="ai-guide-question">{assistantCopy.inputLabel}</label>
                <input
                  id="ai-guide-question"
                  ref={inputRef}
                  value={question}
                  autoComplete="off"
                  onChange={(event) => setQuestion(event.target.value)}
                  placeholder={assistantCopy.placeholder}
                />
                <button type="submit" aria-label={assistantCopy.send} disabled={!question.trim() || pending}>
                  <Send size={16} aria-hidden="true" />
                </button>
              </form>

              <Link className="ai-guide-contact" href={contactPath} onClick={() => setAssistantOpen(false)}>
                {assistantCopy.contact}
                <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
            </section>
          )}
        </div>
      </div>
    </section>
  );
}