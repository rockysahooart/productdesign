/* READING JOURNEYS (owner, 2026-11-21; Ada). Each case study opens with a short, first-person path through the same
   comprehension flow - the world, the problem, my role, what I decided, what I built, where it ended up - for a reader
   who knows nothing about the field. Every sentence is drawn from that page's own text and glossary (nothing new is
   claimed), and each step links to the full section below it, which is unchanged: the journey is the overview, the
   page is the depth. Inserted after the masthead by assets/vf/app.js. Targets: a CSS selector on the page. */
window.VF_JOURNEYS = {
  /* Craigslist (owner, 2026-11-23: the two-layer pilot with Carry). Same rule: every sentence restates the page. */
  craigslist: {
    title: 'The short version',
    steps: [
      ['Buyers come to Craigslist for local listings, and sellers pay to post them', 'Craigslist is a two-sided marketplace: buyers come for local listings, and private sellers and dealers pay to post them. If browsing felt clearer and listings told people more, buyers might trust the app enough to come back, and sellers would have a reason to post again.', '.cs-wrap > section:nth-of-type(1)', 'The brief'],
      ['LiveFront asked me to rethink the iPhone app, and I chose one journey', 'It was a paid design challenge, and I was the designer: I ran the research, made the design decisions, built the Figma file and a coded prototype. Craigslist sells almost everything, so I chose one journey to redesign well: shopping for a used car.', '.cs-wrap > section:nth-of-type(2)', 'Why one journey'],
      ['In usability sessions, people hesitated screen after screen', 'I asked people to shop for a car in the current app and looked closely at every screen they passed through. The friction often showed up as a pause before the next tap, and friction like that can make people give up on a search.', '.cs-wrap > section:nth-of-type(3)', 'What I saw'],
      ['Before designing, I set three rules for comfort, clarity and effort', 'Touch targets comfortable enough to avoid misclicks, a hierarchy that follows what people are trying to do, and main actions that take no extra effort on a bigger phone or with smaller hands. I kept Craigslist’s own type and colours so it still felt like Craigslist.', '.cs-wrap > section:nth-of-type(4)', 'The three rules'],
      ['I kept the journey people knew and reorganized each screen', 'Home, browsing, search, results and a listing stay in the order people already know; what sits on each screen changed. I then built the redesign as a working prototype in HTML, CSS and JavaScript, so you can feel how it behaves.', '.cs-wrap > section:nth-of-type(5)', 'See each screen'],
      ['The next step is testing it with car shoppers', 'The redesigned screens and the prototype haven’t been tested with car shoppers yet, so that comes next. Revising this project also changed how I present research: I’d rather show fewer findings I can trace than numbers I can’t stand behind.', '.cs-wrap > section:nth-of-type(11)', 'What comes next']
    ]
  },
  carry: {
    title: 'The short version',
    steps: [
      ['Patients leave follow-up appointments with a lot to remember', 'After cancer treatment, patients come back for follow-up visits at set intervals, and part of each visit decides whether the interval changes. A lot is said in a short appointment: a result, what it means, and what to do before the next one.', '[data-phase-anchor="02"]', 'The patients I designed for'],
      ['Much of what was said is gone by the time they get home', 'Attention, emotion, time and memory make the details hard to hold onto. The feedback the team held rarely described forgetting one fact. It described losing the whole fifteen minutes, and the questions a patient wrote beforehand never met the answers they heard.', null, 'Read the context'],
      ['I had three weeks, and Carry had to fit inside an app patients already used', 'I was one of three designers inside a larger healthcare technology client, handed a premise from a workshop and three weeks to work in. Carry had to fit inside PatientX, the patient app the client already shipped, without changing any of it.', '[data-phase-anchor="01"]', 'What I was given'],
      ['I settled three rules before drawing a single screen', 'Before drawing a screen I settled three things: patients edit their questions in place and can undo anything; Carry never writes answers itself; and Carry does not record, because consent moved out of the product. Testing with patients, onsite and in an unmoderated testing tool, then moved the preparation checklist below the questions.', '[data-phase-anchor="03"]', 'How the decisions were made'],
      ['Carry links each question to the moment in the conversation that answers it', 'A patient writes questions before a visit. Afterwards, if they choose to upload a recording, Carry transcribes it and links each question to the moment that answers it, as a quotation they can check. A question nothing answers clearly stays visibly unanswered.', '[data-phase-anchor="04"]', 'See the flow and its states'],
      ['I handed the work to a first build and wrote down what was still open', 'I handed the flows, states and component set to a first build. A leadership change above me stopped it before release, and I logged the questions I couldn’t answer rather than deciding them quietly. The figure at the top of the page is an estimate, shown with its calculation.', '[data-phase-anchor="05"]', 'What I handed off']
    ]
  },
  optiflow: {
    title: 'The short version',
    steps: [
      ['When an insurer replies to a medical bill, the reply is a scanned letter', 'When an insurer (the payor) responds to a claim, the reply arrives as a scanned document, and most of these concern a denial: the payor refusing to pay. Each document moves through a six-step pipeline where an AI model proposes what it says and a person checks it.', '[data-phase-anchor="02"]', 'Follow one document through'],
      ['Reviewers had to move fast, and their corrections taught the system nothing', 'At step five, tagging, a reviewer checks the labels the model proposed. They had to clear a queue quickly and still tell a confident suggestion from a guess. And when they disagreed, a correction taught the system nothing on its own; a free-text note could be stored and never read.', 'figure.ofw', 'The screen I designed'],
      ['I designed the step where a person checks the model’s work', 'I was the product designer for the tagging step and its review flow, working with product, engineering and the operations reviewers who used it. The design was delivered and handed to engineering.', '[data-phase-anchor="01"]', 'The three roles involved'],
      ['I made agreeing effortless and disagreeing informative', 'Agreeing stays one action, because nearly every tag is accepted. A change opens a short, fixed list of reasons right where the change happened. A tag the model has nothing to say about gets its own state, so it never looks certain. And the quoted text behind each suggestion sits next to it, so agreeing also means checking the evidence.', '[data-phase-anchor="03"]', 'Read the decisions'],
      ['Every correction now arrives sorted, attributed and tied to its evidence', 'Every correction now arrives sorted into a category, attributed, and attached to the evidence it was made against, so engineering can read it when revising the model’s instructions, tag definitions and thresholds. The walkthrough at the top of the page shows the screen.', '[data-phase-anchor="04"]', 'How a ticket moved'],
      ['Confidence rose about two points a week, and that belongs to the whole team’s cycle', 'During the tuning cycle, the model’s confidence rose by about 2 percentage points a week, with engineering shipping changes roughly every two weeks. That gain belongs to the whole cycle, not to my screen. If I did it again, I’d measure the reasons reviewers pick from day one.', '[data-phase-anchor="05"]', 'The cycle the work fed']
    ]
  },
  specimen: {
    title: 'The short version',
    steps: [
      ['A patient’s tissue sample travels from the clinic to a lab in a kit', 'A clinician prepares a patient’s tissue to the lab’s specification, packs it into a kit and ships it. At the lab, a test called an assay is run on it.', 'text:The kit as it shipped', 'The kit as I found it'],
      ['The instructions buried the reasons a sample gets refused', 'The whole specification sat on one sheet in the kit’s lid, and the conditions under which the lab refuses a sample were printed lowest, read after the decision they were meant to prevent. The base held nothing, so the container travelled loose. A refused sample writes off the whole test, and tumour tissue can’t casually be collected again.', 'text:Research', 'What I observed'],
      ['I joined a three-person subteam for two weeks', 'In a two-week engagement, I was the support UX designer in a three-person subteam, with a senior designer owning direction. I redesigned the instruction lid, proposed storage inside the box, and wrote the subteam’s tickets.', '[data-phase-anchor="01"]', 'The two changes'],
      ['I reordered the sheet so the costly mistakes read first', 'Nobody was re-tooling the box, so I kept the sheet where it was and changed the order of what it said: the requirement that never changes now sits in one cell, the slide count is the only value that differs, and the refusal conditions are a labelled row near the top.', 'text:Design decision 01', 'Reordering the sheet'],
      ['I gave the sample one place to sit inside the box', 'For the empty base, I specified a one-piece die-cut foam insert with a cavity shaped to each container, so the sample has one place to sit, fitted to a box already in manufacture.', 'text:Design decision 02', 'The insert I specified'],
      ['It ended as a specification, and taught me that placement mattered most', 'This was documentation and specification. I didn’t see it through manufacture, so there are no production or rejection-rate figures; the figure at the top is an estimate, shown with its calculation. What I learned: neither change added information. Both were about placement.', '[data-phase-anchor="05"]', 'What both changes had in common']
    ]
  },
  audit: {
    title: 'The short version',
    steps: [
      ['Cancer specialists use a portal between patients to order tests and read results', 'Oncology providers (a doctor, a nurse, a testing coordinator) use a provider portal to order tests, track samples, read results and clear follow-up work. Most of them are in it briefly, between patients.', 'text:Proto personas', 'The three provider roles'],
      ['The same action looked different on every screen', 'Across four workflows, the same required action was a button in one row, a link in another and a menu item in a third. Labels named what the system was doing, not who had to act, and a failed submission said only that it had failed. The design system’s own check passed anyway.', 'text:What repeated across them', 'What the audit found'],
      ['I audited the workflows and set the standards that fixed them', 'I was the product designer for the audit, the component and copy standards, and the handoff, working with product, engineering and the design system team.', '[data-phase-anchor="01"]', 'What the audit covered'],
      ['I turned four separate fixes into one shared row', 'The same four problems repeated in all four workflows, so I made one shared row pattern instead of four redesigns: one required action per row, always in the same column; status labels that say who has to act; errors that name the missing field; and no status shown by colour alone.', '[data-phase-anchor="03"]', 'How I ranked what repeated'],
      ['You can watch each workflow before and after, on the same record', 'The demos at the top run each workflow twice, before and after, with the same record and the same eighteen seconds, so the only difference is the system.', '#ap-demo', 'Watch the demos'],
      ['Handing over the rules taught me what keeps a design system from drifting', 'I delivered documentation: the row pattern, approved labels, measured contrast pairings, error rules and acceptance criteria, handed to product and engineering. There are no adoption figures. If I did it again, I’d build the check that catches a regression, and watch people read the new words before changing them.', '[data-phase-anchor="05"]', 'What I delivered']
    ]
  },
  sbl: {
    title: 'The short version',
    steps: [
      ['Sometimes people need to borrow money without selling their investments', 'Securities-based lending makes that possible: a client borrows against investments they already hold. At the bank, a banker uses an internal console to put each request together: the client, the accounts used as collateral, the evaluation, and the handoff to underwriting.', '.cs-wrap > section:nth-of-type(1)', 'The problem'],
      ['As demand grew, bankers faced more applications on the same scattered screens', 'As demand grew, the console had to handle more applications without more effort. The details sat on dense, disconnected screens, and missing information and late exceptions caused errors, rework and delays.', null, 'Read the problem'],
      ['I was the only designer, and the brief was to modernize, not reinvent', 'I was the sole UX designer for three months. The business asked for modernization, not a new way of working.', '.cs-wrap > section:nth-of-type(2)', 'What I did'],
      ['I kept every familiar screen and added what bankers were missing', 'I kept the same screens, in the same order, with the same sections, labels and actions, and added what bankers were missing: a status panel listing every open item, linked to the field that completes it, and disabled buttons that always say why.', '.cs-wrap > section:nth-of-type(3)', 'The decisions'],
      ['The before-and-after screens show the same console, made clearer', 'The redesigned console, the demo and the before-and-after screens show the result side by side.', '.cs-wrap > section:nth-of-type(4)', 'Before and after']
    ]
  }
};
