/* READING JOURNEYS (owner, 2026-11-21; Ada). Each case study opens with a short, first-person path through the same
   comprehension flow - the world, the problem, my role, what I decided, what I built, where it ended up - for a reader
   who knows nothing about the field. Every sentence is drawn from that page's own text and glossary (nothing new is
   claimed), and each step links to the full section below it, which is unchanged: the journey is the overview, the
   page is the depth. Inserted after the masthead by assets/vf/app.js. Targets: a CSS selector on the page. */
window.VF_JOURNEYS = {
  carry: {
    title: 'The short version',
    steps: [
      ['What a follow-up visit is like', 'After cancer treatment, patients come back for follow-up visits at set intervals, and part of each visit decides whether the interval changes. A lot is said in a short appointment: a result, what it means, and what to do before the next one.', '[data-phase-anchor="01"]', 'The patients I designed for'],
      ['Where it goes wrong', 'Attention, emotion, time and memory make the details hard to hold onto. The feedback the team held rarely described forgetting one fact. It described losing the whole fifteen minutes, and the questions a patient wrote beforehand never met the answers they heard.', '[data-phase-anchor="01"]', 'Read the context'],
      ['What I was asked to do', 'I was one of three designers inside a larger healthcare technology client, handed a premise from a workshop and three weeks to work in. Carry had to fit inside PatientX, the patient app the client already shipped, without changing any of it.', '[data-phase-anchor="01"]', 'What I was given'],
      ['What I decided along the way', 'Before drawing a screen I settled three things: patients edit their questions in place and can undo anything; Carry never writes answers itself; and Carry does not record, because consent moved out of the product. Testing with patients, onsite and in an unmoderated testing tool, then moved the preparation checklist below the questions.', '[data-phase-anchor="03"]', 'How the decisions were made'],
      ['What Carry does', 'A patient writes questions before a visit. Afterwards, if they choose to upload a recording, Carry transcribes it and links each question to the moment that answers it, as a quotation they can check. A question nothing answers clearly stays visibly unanswered.', '[data-phase-anchor="02"]', 'See the flow and its states'],
      ['Where it ended up', 'I handed the flows, states and component set to a first build. A leadership change above me stopped it before release, and I logged the questions I couldn’t answer rather than deciding them quietly. The figure at the top of the page is an estimate, shown with its calculation.', '[data-phase-anchor="05"]', 'What I handed off']
    ]
  },
  optiflow: {
    title: 'The short version',
    steps: [
      ['How a billing letter is handled', 'When an insurer (the payor) responds to a claim, the reply arrives as a scanned document, and most of these concern a denial: the payor refusing to pay. Each document moves through a six-step pipeline where an AI model proposes what it says and a person checks it.', '[data-phase-anchor="02"]', 'Follow one document through'],
      ['Where it goes wrong', 'At step five, tagging, a reviewer checks the labels the model proposed. They had to clear a queue quickly and still tell a confident suggestion from a guess. And when they disagreed, a correction taught the system nothing on its own; a free-text note could be stored and never read.', '[data-phase-anchor="03"]', 'The screen I designed'],
      ['What I was asked to do', 'I was the product designer for the tagging step and its review flow, working with product, engineering and the operations reviewers who used it. The design was delivered and handed to engineering.', '[data-phase-anchor="01"]', 'The three roles involved'],
      ['What I decided', 'Agreeing stays one action, because nearly every tag is accepted. A change opens a short, fixed list of reasons right where the change happened. A tag the model has nothing to say about gets its own state, so it never looks certain. And the quoted text behind each suggestion sits next to it, so agreeing also means checking the evidence.', '[data-phase-anchor="03"]', 'Read the decisions'],
      ['What it does', 'Every correction now arrives sorted into a category, attributed, and attached to the evidence it was made against, so engineering can read it when revising the model’s instructions, tag definitions and thresholds. The walkthrough at the top of the page shows the screen.', '[data-phase-anchor="04"]', 'How a ticket moved'],
      ['Where it ended up', 'During the tuning cycle, the model’s confidence rose by about 2 percentage points a week, with engineering shipping changes roughly every two weeks. That gain belongs to the whole cycle, not to my screen. If I did it again, I’d measure the reasons reviewers pick from day one.', '[data-phase-anchor="05"]', 'The cycle the work fed']
    ]
  },
  specimen: {
    title: 'The short version',
    steps: [
      ['How a tissue sample reaches the lab', 'A clinician prepares a patient’s tissue to the lab’s specification, packs it into a kit and ships it. At the lab, a test called an assay is run on it.', '[data-phase-anchor="02"]', 'The kit as I found it'],
      ['Where it goes wrong', 'The whole specification sat on one sheet in the kit’s lid, and the conditions under which the lab refuses a sample were printed lowest, read after the decision they were meant to prevent. The base held nothing, so the container travelled loose. A refused sample writes off the whole test, and tumour tissue can’t casually be collected again.', '[data-phase-anchor="02"]', 'What I observed'],
      ['What I was asked to do', 'In a two-week engagement, I was the support UX designer in a three-person subteam, with a senior designer owning direction. I redesigned the instruction lid, proposed storage inside the box, and wrote the subteam’s tickets.', '[data-phase-anchor="01"]', 'The two changes'],
      ['What I decided', 'Nobody was re-tooling the box, so I kept the sheet where it was and changed the order of what it said: the requirement that never changes now sits in one cell, the slide count is the only value that differs, and the refusal conditions are a labelled row near the top.', '[data-phase-anchor="03"]', 'Reordering the sheet'],
      ['What I designed', 'For the empty base, I specified a one-piece die-cut foam insert with a cavity shaped to each container, so the sample has one place to sit, fitted to a box already in manufacture.', '[data-phase-anchor="04"]', 'The insert I specified'],
      ['Where it ended up', 'This was documentation and specification. I didn’t see it through manufacture, so there are no production or rejection-rate figures; the figure at the top is an estimate, shown with its calculation. What I learned: neither change added information. Both were about placement.', '[data-phase-anchor="05"]', 'What both changes had in common']
    ]
  },
  audit: {
    title: 'The short version',
    steps: [
      ['Who uses this portal, and how', 'Oncology providers (a doctor, a nurse, a testing coordinator) use a provider portal to order tests, track samples, read results and clear follow-up work. Most of them are in it briefly, between patients.', '[data-phase-anchor="02"]', 'The three provider roles'],
      ['Where it goes wrong', 'Across four workflows, the same required action was a button in one row, a link in another and a menu item in a third. Labels named what the system was doing, not who had to act, and a failed submission said only that it had failed. The design system’s own check passed anyway.', '[data-phase-anchor="01"]', 'What the audit found'],
      ['What I was asked to do', 'I was the product designer for the audit, the component and copy standards, and the handoff, working with product, engineering and the design system team.', '[data-phase-anchor="01"]', 'What the audit covered'],
      ['What I decided', 'The same four problems repeated in all four workflows, so I made one shared row pattern instead of four redesigns: one required action per row, always in the same column; status labels that say who has to act; errors that name the missing field; and no status shown by colour alone.', '[data-phase-anchor="03"]', 'How I ranked what repeated'],
      ['What it looks like', 'The demos at the top run each workflow twice, before and after, with the same record and the same eighteen seconds, so the only difference is the system.', '#ap-demo', 'Watch the demos'],
      ['Where it ended up', 'I delivered documentation: the row pattern, approved labels, measured contrast pairings, error rules and acceptance criteria, handed to product and engineering. There are no adoption figures. If I did it again, I’d build the check that catches a regression, and watch people read the new words before changing them.', '[data-phase-anchor="05"]', 'What I delivered']
    ]
  },
  sbl: {
    title: 'The short version',
    steps: [
      ['What securities-based lending is', 'It lets a client borrow against investments they already hold. At the bank, a banker uses an internal console to put each request together: the client, the accounts used as collateral, the evaluation, and the handoff to underwriting.', '.cs-wrap > section:nth-of-type(1)', 'The problem'],
      ['Where it goes wrong', 'As demand grew, the console had to handle more applications without more effort. The details sat on dense, disconnected screens, and missing information and late exceptions caused errors, rework and delays.', '.cs-wrap > section:nth-of-type(1)', 'Read the problem'],
      ['What I was asked to do', 'I was the sole UX designer for three months. The business asked for modernization, not a new way of working.', '.cs-wrap > section:nth-of-type(2)', 'What I did'],
      ['What I decided', 'I kept the same screens, in the same order, with the same sections, labels and actions, and added what bankers were missing: a status panel listing every open item, linked to the field that completes it, and disabled buttons that always say why.', '.cs-wrap > section:nth-of-type(2)', 'The decisions'],
      ['What changed', 'The redesigned console, the demo and the before-and-after screens show the result side by side.', '.cs-wrap > section:nth-of-type(4)', 'Before and after']
    ]
  }
};
