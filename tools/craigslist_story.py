"""Craigslist case study: the chronological first-person story (owner, 2026-11-21), inserted by tools/vfinal_build.py
around the page's existing artifacts (hero, final screens, prototype and its notes), which are unchanged.

Sources, and only these: the LiveFront deck as submitted on October 14 (preserved in Figma file uBDKd4xLS50msiung2aDGJ,
page "Original deck · as submitted Oct 14"), its November 2026 revision note, and the prototype README
(rockysahooart/craigslist-livefront-prototype). Research counts from the deck (slides 9, 12-13, 20-23, 25) are left
out on purpose: the revision note records that they could not be traced to session notes, tasks, participants or the
version tested. Design responses are described as the deck describes them: intended benefits, untested.
"""

BEFORE = '''<section class="sec"><div class="pair"><h2 class="h">The brief</h2>
<p class="p">LiveFront asked me to rethink Craigslist&rsquo;s iPhone app. It was a paid design challenge, and I was the designer: I ran the research, made the design decisions, built the Figma file, presented the work in a deck on October&nbsp;14, and built a coded prototype of the screens.</p>
<p class="p">Craigslist is a two-sided marketplace. Buyers come for local listings, and private sellers and dealers pay to post them. So I started with a simple question: if browsing felt clearer and listings told people more, would buyers trust the app enough to come back? And if they did, would sellers, who pay $5 a listing, have a reason to post again?</p>
<p class="p">I sketched what that could be worth, as an illustration rather than a forecast: every additional $5 post, less an assumed $1 in operating cost, contributes $4 toward recovering the cost of the design work.</p></div></section>
<section class="sec"><div class="pair"><h2 class="h">Narrowing the problem</h2>
<p class="p">Craigslist sells almost everything, and I couldn&rsquo;t redesign all of it well. I chose one journey: shopping for a used car. That meant two moments in particular, browsing through cars and looking closely at one.</p>
<p class="p">Whatever someone is buying, they&rsquo;re trying to answer the same few questions before they reach out to a seller: can I afford it, will it fit my space, is it safe to pick up, is it still available, and is it in good condition? A listing that hides those answers makes the whole experience feel awkward, and I wanted the redesign to bring them forward.</p></div></section>
<section class="sec"><div class="pair"><h2 class="h">Watching people use the current app</h2>
<p class="p">I ran usability sessions on the current app, asking people to shop for a car, and I looked closely at every screen they passed through. The friction showed up screen by screen, often as a pause before the next tap:</p>
<ul class="clb"><li>On the first screen, &ldquo;categories&rdquo; and &ldquo;my searches&rdquo; sit right next to the search field, and taps landed on the wrong one.</li>
<li>The cars and trucks category was hard to find inside a long list of every category Craigslist has.</li>
<li>Setting a price meant going back through a filter screen that felt confusing.</li>
<li>Recent searches repeated the same location on every line, so finding the exact search meant reading each one.</li>
<li>On a listing, the trash icon looked like it would delete someone else&rsquo;s post, and the star didn&rsquo;t seem to do anything.</li></ul>
<p class="p">Friction like this can make people give up on a search and trust Craigslist a little less.</p>
<p class="p">A note on evidence. The deck I submitted attached participant counts to these findings. When I revised the work in November, I couldn&rsquo;t trace those numbers back to session notes, tasks or participants, so I&rsquo;ve left them out here. On each screen below, I say whether a problem came from what people reported or from my own observation.</p></div></section>
<section class="sec"><div class="pair"><h2 class="h">Deciding how to approach it</h2>
<p class="p">Before drawing anything, I set three rules for myself. Touch targets should be comfortable enough to avoid misclicks. Information should have a clear hierarchy that follows what people are trying to do. And the main actions shouldn&rsquo;t take extra effort for someone with smaller hands, a bigger phone, or both.</p>
<p class="p">I also wanted the redesign to feel modern without feeling foreign. I worked from Apple&rsquo;s iOS 26 design kit and Human Interface Guidelines, kept text and colour accessibility in mind, and kept Craigslist&rsquo;s own type and colours, so the layout and components could change while the app still felt like Craigslist. I documented each screen and component against the Apple guideline pages I checked on October&nbsp;13. Those pages informed my decisions; they don&rsquo;t prove compliance, and the accessibility items are untested.</p></div></section>
<section class="sec"><div class="pair"><h2 class="h">A familiar experience, reorganized</h2>
<p class="p">I kept the journey people already knew, Home, browsing, search, results and a listing, and reorganized what sat on each screen. The redesigned screens use a different city and sample listings from the screenshots of the current app.</p>
<h3 class="h3">Home: search takes the lead</h3>
<p class="p">The search field shared its space with &ldquo;my searches&rdquo; (people reported this), the category list filled the first screen (my observation), and the location showed no search radius (people reported that proximity was unclear). I let the search field lead, gave saved searches their own labelled entry, put the full category list behind an &ldquo;All categories&rdquo; pill so nearby listings show first, and showed the location, a 25-mile radius and a map of the search area. The tradeoff: categories are no longer visible at a glance, and longtime users may need to relearn the path.</p>
<h3 class="h3">Browsing cars and trucks: show what buyers compare</h3>
<p class="p">Category and location were split across two header menus and the radius wasn&rsquo;t shown (reported), cards showed only a title and price (reported), and filters sat behind an unlabelled icon (my observation). I gathered category, location and radius into one row of pills, put the price on the photo with mileage, seller type, time and area beneath it, and gave Filters and Save search visible labels above the list. Fewer listings fit on one screen as a result.</p>
<h3 class="h3">Search: recent searches you can scan</h3>
<p class="p">Every recent search repeated its location, and the only sign of focus was the text cursor (both my observations). Now the query comes first, the scope appears only when it differs, and a focus ring and a scope line show where the search will run.</p>
<h3 class="h3">Results: every filter in one row</h3>
<p class="p">An applied price sat in its own row, away from location and category (my observation), and the results didn&rsquo;t show the search radius (reported). The price now joins the same row as the other filters, with an &times; to remove it and a count on Filters, and the location and radius pills lead that row. Pills that run past the screen edge need a horizontal scroll.</p>
<h3 class="h3">A listing: clearer facts, a clearer next step</h3>
<p class="p">On a real listing I studied, the trash icon could be read as deleting the post, key facts were mixed into the description, and repair needs like &ldquo;transmission stuck in gear&rdquo; were buried in prose. I proposed moving the secondary action into a labelled More menu (the menu itself isn&rsquo;t designed yet), grouped what the seller provided into a details grid with the description and an approximate pickup area, and proposed surfacing condition issues explicitly. For engineering, I proposed using structured seller fields first, extracting only explicit facts from the description, keeping the original text, and marking anything missing as &ldquo;Not provided.&rdquo;</p>
<p class="p">These are design responses, and they&rsquo;re untested. Each one is the benefit I intended, not one I measured.</p></div></section>
<section class="sec"><div class="pair"><h2 class="h">The final screens</h2>
<p class="p">Five key screens in one journey, from Home in Minneapolis to the details of one car.</p></div>'''

GALLERY_OPEN = '<div class="grid6">'

AFTER = '''<section class="sec"><div class="pair"><h2 class="h">What I&rsquo;d do next</h2>
<p class="p">The redesigned screens and the prototype haven&rsquo;t been tested with car shoppers yet, so the next step is to put this prototype in front of the people it was designed for and see which of these decisions actually reduce the hesitation I saw.</p>
<p class="p">Revising this project also changed how I present research. I&rsquo;d rather show fewer findings I can trace to their source than numbers I can&rsquo;t stand behind.</p></div></section>
'''

# Opening visual (owner, 2026-11-21): the deck's own before/after slide ("A familiar experience, just reorganized.",
# slide 19 of the October 14 deck, exported unchanged from the Figma file's preserved original-deck page). It precedes
# the existing animated hero, which stays. On phones it pans inside its own frame so the screens stay legible.
BEFORE_AFTER = ('<figure class="hero vf-ba"><div class="vf-ba-scroll" role="region" aria-label="Before and after, scrollable" tabindex="0">'
                '<img src="assets/vf/cs/craigslist/before-after-deck-19.png" width="1920" height="1080" loading="eager" decoding="async" '
                'alt="Five screens of the current Craigslist app in Austin, Texas, above the same five screens in my redesign in '
                'Minneapolis: Home, cars and trucks browsing, search entry, search results with filtering, and item details."></div>'
                '<figcaption class="cap">Before and after, from the deck I presented. Top row: the current app. Bottom row: my redesign of '
                'the same five steps, from Home to a single listing. The screens use different cities and sample listings.</figcaption></figure>')


def details(summary, body):
    return '<details class="vf-more"><summary>%s</summary>%s</details>' % (summary, body)


def prototype(s):
    """The prototype part of the page, told in first person, with the long behaviour lists one tap away
    (progressive disclosure: every word kept, the screenshots stay in view)."""
    import re
    rep = [
        ('<h2 class="h">Craigslist iOS redesign: browser prototype</h2>', '<h2 class="h">Try the prototype I built</h2>'),
        ('<p class="p">A static HTML/CSS/JavaScript prototype of the Craigslist iOS car-shopping redesign. It\'s a 430 × 932 pt iPhone screen, built from the handoff and the Figma file <code>uBDKd4xLS50msiung2aDGJ</code>.</p>',
         '<p class="p">Screens show how the redesign looks; I wanted people to feel how it behaves. So I built it as a working prototype in HTML, CSS and JavaScript, an iPhone screen at 430 × 932 points, from my handoff and the Figma file.</p>'),
        ('<p class="p"><b>Live prototype:</b> <a href="https://rockysahooart.github.io/craigslist-livefront-prototype/">https://rockysahooart.github.io/craigslist-livefront-prototype/</a>. Open it on a phone for the full-screen version.</p>',
         '<p class="p"><a class="lk" href="https://rockysahooart.github.io/craigslist-livefront-prototype/" target="_blank" rel="noopener">Try the live prototype <span aria-hidden="true">↗</span></a> It opens full screen on a phone.</p>'),
    ]
    for a, b in rep:
        assert a in s, a[:60]
        s = s.replace(a, b, 1)
    # Prototype notes: what is real and what is sample data
    m = re.search(r'<h3 class="h3">Prototype notes</h3>(<ul class="clb">.*?</ul>)', s, re.S)
    s = s[:m.start()] + details('Prototype notes: what\u2019s real, and what\u2019s sample data', m.group(1)) + s[m.end():]
    # Discovery journey: the behaviour list (nested) one tap away; its screenshots stay
    a = s.index('<section class="sec"><h3 class="h3"><b>Discovery journey.</b></h3>')
    u0 = s.index('<ul class="clb">', a); u1 = re.compile(r'</ul>\s*<div class="grid4">').search(s, u0).start() + len('</ul>')
    s = s[:u0] + details('How each screen behaves', s[u0:u1]) + s[u1:]
    # Filtering: the summary sentence stays; the two lists open on request
    a = s.index('<b>Filtering: one shared filter state.</b>')
    u0 = s.index('<ul class="clb">', a); u1 = re.compile(r'</ul>\s*<div class="grid4">').search(s, u0).start() + len('</ul>')
    s = s[:u0] + details('What the filters combine, and how the panels behave', s[u0:u1]) + s[u1:]
    # Returning concept: the framing sentence stays; the feature list opens on request
    a = s.index('<b>Returning to a car search (exploratory concept, not validated).</b>')
    u0 = s.index('<ul class="clb">', a); u1 = re.compile(r'</ul>\s*<div class="grid4">').search(s, u0).start() + len('</ul>')
    s = s[:u0] + details('What the concept does', s[u0:u1]) + s[u1:]
    return s
