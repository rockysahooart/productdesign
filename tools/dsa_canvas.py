"""Design System Audit visual (owner, 2026-11-24): a Figma-style canvas of the audit's design system in progress, replacing
the isometric diagram. Every label, status, colour, contrast figure, workflow and copy line is the audit's own (its case
study and its previous visual): the four status tokens and their colours with the measured contrast ratios, the before
chips, the four workflows, the ORD-458734 row before / after, the error copy. Type sizes and spacing steps are shown as a
working system sheet would show them. Built by tools/vfinal_build.py; dark and light canvases."""

F = "Geist,Inter,-apple-system,Segoe UI,sans-serif"


def svg(theme='d'):
    D = theme == 'd'
    C = dict(canvas='#1C1C1E' if D else '#F1F0EE', dot='#2A2A2D' if D else '#DDDBD7', frame='#232326' if D else '#FFFFFF',
             fb='#34343A' if D else '#E2E0DC', lab='#8C8B90' if D else '#7A7873', ink='#ECEAE6' if D else '#1E1E20',
             ink2='#B4B2AD' if D else '#55534F', mute='#77767C' if D else '#9A9893', rule='#34343A' if D else '#E6E4E0',
             field='#1B1B1E' if D else '#F7F6F4', sel='#0D99FF', btn='#ECEAE6' if D else '#1E1E20', btnt='#141416' if D else '#FFFFFF')
    S = [('#E8B55F', 'Awaiting provider action', '4.52:1'), ('#A9A0FF', 'Needs clinical review', '5.98:1'),
         ('#7FB6DD', 'Lab review in progress', '5.54:1'), ('#F0908A', 'Submission error', '3.95:1')]
    o = []
    a = o.append

    def t(x, y, s, size=13, fill=None, w=400, anchor='start', ls=0):
        a('<text x="%s" y="%s" font-size="%s" font-weight="%s" fill="%s" text-anchor="%s"%s>%s</text>' % (
            x, y, size, w, fill or C['ink'], anchor, (' letter-spacing="%s"' % ls) if ls else '', s))

    def frame(x, y, w, h, name):
        t(x, y - 9, name, 12, C['lab'], 500)
        a('<rect x="%s" y="%s" width="%s" height="%s" rx="6" fill="%s" stroke="%s"/>' % (x, y, w, h, C['frame'], C['fb']))

    def pill(x, y, w, h, fill, stroke=None, op=1):
        a('<rect x="%s" y="%s" width="%s" height="%s" rx="%s" fill="%s"%s%s/>' % (x, y, w, h, h / 2, fill,
          (' stroke="%s"' % stroke) if stroke else '', (' fill-opacity="%s"' % op) if op != 1 else ''))

    a('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1000" width="100%%" height="100%%" preserveAspectRatio="xMidYMid meet" '
      'role="img" aria-label="Design System Audit: the provider portal design system in progress on a Figma canvas: status colour '
      'tokens with measured contrast, type styles, spacing, actions, inputs, badges and chips, and the provider action queue row '
      'before and after the audit." font-family="%s">' % F)
    a('<defs><pattern id="dsd%s" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="%s"/></pattern></defs>' % (theme, C['dot']))
    a('<rect width="1080" height="1000" fill="%s"/><rect width="1080" height="1000" fill="url(#dsd%s)"/>' % (C['canvas'], theme))
    # page tab, like a Figma file
    t(40, 34, 'Provider portal · Design system', 13, C['ink2'], 500)
    t(1040, 34, 'Audit · v2', 12, C['mute'], 400, 'end')

    # 1 colour: status tokens + ink ramp
    frame(40, 70, 500, 250, 'Color / Status tokens')
    for i, (c, n, r) in enumerate(S):
        y = 92 + i * 52
        a('<rect x="60" y="%s" width="40" height="40" rx="6" fill="%s"/>' % (y, c))
        t(114, y + 17, n, 14, C['ink'], 500)
        t(114, y + 35, ['status/awaiting-provider', 'status/clinical-review', 'status/lab-review', 'status/error'][i], 12, C['mute'])
        pill(440, y + 9, 82, 22, C['field'], C['rule'])
        t(481, y + 24, r + ' AA', 11.5, C['ink2'], 500, 'middle')

    # 2 type
    frame(570, 70, 470, 250, 'Type / Styles')
    for i, (n, sz, spec) in enumerate([('Display', 30, '32/40 · Semibold'), ('Title', 20, '20/28 · Semibold'),
                                       ('Body', 15, '15/22 · Regular'), ('Caption', 12, '12/16 · Medium')]):
        y = 118 + i * 52
        t(590, y, n, sz, C['ink'], 600 if i < 2 else 400)
        t(1020, y, spec, 12, C['mute'], 400, 'end')
        if i < 3:
            a('<line x1="590" y1="%s" x2="1020" y2="%s" stroke="%s"/>' % (y + 16, y + 16, C['rule']))

    # 3 actions
    frame(40, 360, 300, 230, 'Components / Actions')
    pill(60, 384, 150, 40, C['btn']); t(135, 409, 'Submit order', 14, C['btnt'], 600, 'middle')
    pill(60, 436, 150, 40, 'none', C['fb']); t(135, 461, 'Review', 14, C['ink'], 500, 'middle')
    t(60, 507, 'Open', 14, C['ink'], 500); a('<line x1="60" y1="511" x2="94" y2="511" stroke="%s"/>' % C['ink'])
    t(60, 546, 'Primary · Secondary · Link', 12, C['mute'])
    t(60, 566, 'One required action per row', 12, C['mute'])
    for i, s in enumerate(['Default', 'Hover', 'Focus']):
        pill(230, 384 + i * 52, 90, 40, C['btn'] if i != 2 else C['btn'], C['sel'] if i == 2 else None, 1 if i == 0 else .82 if i == 1 else 1)
        t(275, 409 + i * 52, s, 12.5, C['btnt'], 600, 'middle')

    # 4 inputs
    frame(370, 360, 330, 230, 'Components / Inputs')
    t(390, 392, 'Specimen source', 12.5, C['ink2'], 500)
    a('<rect x="390" y="400" width="290" height="40" rx="6" fill="%s" stroke="%s"/>' % (C['field'], C['fb']))
    t(404, 425, 'Select a source', 14, C['mute'])
    t(390, 470, 'Specimen source', 12.5, C['ink2'], 500)
    a('<rect x="390" y="478" width="290" height="40" rx="6" fill="%s" stroke="#F0908A"/>' % C['field'])
    t(404, 503, 'Not selected', 14, C['mute'])
    a('<circle cx="397" cy="537" r="6" fill="#F0908A"/>')
    t(410, 541, 'Add missing specimen source', 12.5, '#F0908A' if D else '#B3433C', 500)
    t(390, 572, 'Error states say what to fix', 12, C['mute'])

    # 5 badges and chips
    frame(730, 360, 310, 230, 'Components / Badges &amp; chips')
    for i, (c, n, r) in enumerate(S):
        pill(750, 382 + i * 34, 16 + len(n) * 7.1, 26, c, None, .16 if D else .2)
        a('<circle cx="762" cy="%s" r="4" fill="%s"/>' % (395 + i * 34, c))
        t(772, 400 + i * 34, n, 12.5, c if D else C['ink'], 500)
    for i, n in enumerate(['Orders', 'Specimens', 'Results', 'Tasks']):
        x = 750 + [0, 64, 158, 228][i]
        pill(x, 530, [58, 88, 64, 52][i], 28, 'none', C['fb'])
        t(x + [58, 88, 64, 52][i] / 2, 549, n, 12.5, C['ink2'], 500, 'middle')

    # 6 pattern: provider action queue row, before / after
    frame(40, 630, 660, 330, 'Pattern / Provider action queue row')
    t(60, 662, 'Before', 12, C['mute'], 600)
    a('<rect x="60" y="672" width="620" height="64" rx="6" fill="%s" stroke="%s"/>' % (C['field'], C['rule']))
    t(76, 698, 'ORD-458734 · Robert Brown', 14, C['ink'], 500); t(76, 720, 'Orders', 12, C['mute'])
    pill(330, 690, 80, 26, 'none', C['fb']); t(370, 707, 'Pending', 12, C['ink2'], 500, 'middle')
    pill(560, 688, 104, 30, C['btn']); t(612, 708, 'Submit Order', 12.5, C['btnt'], 600, 'middle')
    t(60, 768, 'After', 12, C['mute'], 600)
    a('<rect x="60" y="778" width="620" height="64" rx="6" fill="%s" stroke="%s"/>' % (C['field'], C['rule']))
    t(76, 804, 'ORD-458734 · Robert Brown', 14, C['ink'], 500); t(76, 826, 'Confirm order details', 12, C['mute'])
    pill(330, 796, 186, 26, '#E8B55F', None, .16 if D else .22); a('<circle cx="343" cy="809" r="4" fill="#E8B55F"/>')
    t(353, 813, 'Awaiting provider action', 12, '#E8B55F' if D else C['ink'], 500)
    pill(560, 794, 104, 30, C['btn']); t(612, 814, 'Submit order', 12.5, C['btnt'], 600, 'middle')
    # selection like Figma's on the after row
    a('<rect x="57" y="775" width="626" height="70" fill="none" stroke="%s" stroke-width="1.5"/>' % C['sel'])
    for hx, hy in [(57, 775), (683, 775), (57, 845), (683, 845)]:
        a('<rect x="%s" y="%s" width="7" height="7" fill="#FFFFFF" stroke="%s"/>' % (hx - 3.5, hy - 3.5, C['sel']))
    # problem / fix callouts
    a('<circle cx="68" cy="878" r="5" fill="#F0908A"/>'); t(82, 883, 'Similar actions looked different across workflows', 12.5, C['ink2'])
    a('<circle cx="68" cy="906" r="5" fill="#7FD1A4"/>'); t(82, 911, 'One treatment per meaning, in the same column every row', 12.5, C['ink2'])
    a('<circle cx="68" cy="934" r="5" fill="#7FD1A4"/>'); t(82, 939, 'Status names the owner and the state; never colour alone', 12.5, C['ink2'])

    # 7 spacing and grid
    frame(730, 630, 310, 330, 'Spacing / Grid')
    for i, v in enumerate([4, 8, 12, 16, 24, 32]):
        y = 656 + i * 30
        a('<rect x="750" y="%s" width="%s" height="14" rx="2" fill="%s" fill-opacity=".7"/>' % (y, v * 4, C['sel']))
        t(1020, y + 12, 'space/%s' % v, 12, C['mute'], 400, 'end')
    t(750, 856, '12 columns · 24 gutter', 12, C['ink2'], 500)
    for i in range(12):
        a('<rect x="%s" y="868" width="16" height="72" fill="#F0908A" fill-opacity="%s"/>' % (750 + i * 23.5, .14 if D else .18))
    a('</svg>')
    return ''.join(o)


if __name__ == '__main__':
    import sys
    open(sys.argv[1], 'w').write(svg(sys.argv[2] if len(sys.argv) > 2 else 'd'))
