# Voice Lounge Hub

THE VOICE LOUNGE — MASTER WEBSITE BUILD PROMPT

Build a complete, production-grade, visually exceptional website for The Voice Lounge, a South African podcast, digital media, video, entertainment, creator, and news platform.

This is not a prototype, mock landing page, wireframe, design exercise, or proof of concept.

Build the actual website experience as though this is intended to become the category-defining “Amazon of podcasts” for South Africa: a large-scale destination where people discover podcasts, stream episodes, watch video podcasts and archived content, follow creators, browse editorial collections, consume entertainment news, discover live programming, and eventually subscribe to premium experiences.

The result should feel capable of competing with the best elements of Spotify, YouTube, Netflix, Apple Podcasts and premium editorial streaming platforms while maintaining a completely original identity belonging to The Voice Lounge. Do not visually clone any existing company.

Use every relevant skill, tool, library, resource, integration, design technique, coding capability, performance technique, browser-testing capability, accessibility technique, animation capability and engineering resource available to you at its fullest reasonable capacity.

Do not stop after generating components. Build, connect, test, polish and refine the entire experience.

1. PRIMARY PRODUCT OBJECTIVE

The Voice Lounge should become South Africa's premium digital destination for spoken-word entertainment.

The primary user journeys are:

Discover great South African podcasts.

Stream audio episodes immediately.

Watch full video podcasts.

Watch previous broadcasts and archived content.

Discover trending episodes and creators.

Follow favourite podcasts and creators.

Browse by genre, language, subject, popularity and format.

Read the latest Voice Lounge and entertainment news.

Discover live or upcoming programming.

Search an extensive podcast catalogue.

Maintain listening/watch history.

Continue episodes across sessions.

Create queues, favourites and saved collections.

Experience personalised discovery.

Explore a compelling premium membership proposition.

The site should immediately communicate that The Voice Lounge is much larger than a conventional podcast website.

It is a media ecosystem.

2. BRAND AND VISUAL DIRECTION

The core brand palette must revolve around:

Black — authority, entertainment, cinematic depth and premium positioning.

Green — energy, discovery, activity, listening status and primary interactions.

Gold — exclusivity, prestige, editorial importance and premium membership.

Suggested starting tokens, which may be refined where necessary for contrast and accessibility:

Black: #050706

Soft Black: #0B0E0C

Surface Black: #111512

Deep Green: #087A49

Brand Green: #11A860

Action Green: a visually light/vibrant green tuned dark enough for accessible white text.

Emerald: #17C875

Gold: #D4AF37

Premium Gold: #E6C65B

Warm Gold Highlight: #F5DB7A

White: #FFFFFF

Off White: #F7F8F5

Muted Grey: #A6ADA8

Do not make the interface look like a generic black-and-green gaming site.

Use colour with restraint.

Black should establish cinematic depth.

Green should communicate interaction, active states and discovery.

Gold should communicate editorial importance and premium value.

Premium screens can contain stronger gold treatments, but gold should never overwhelm the standard experience.

Use sophisticated gradients, glass layers, subtle light bloom, mesh effects, shadows, depth, texture and dimensional surfaces.

Avoid excessive neon effects.

3. GLOBAL CARD COMPONENT — MOST IMPORTANT COMPONENT

The primary reusable UI primitive across the platform must be a media card.

Every card should support:

Thumbnail or artwork.

Optional duration.

Optional category.

Optional episode/show type.

Title.

Short description.

Creator/show name when relevant.

Date or recency information.

Optional metadata such as views, plays or episode number.

Primary Watch action.

Optional overflow/options control.

Optional favourite/save control.

Optional progress bar.

The required primary action is:

Watch

The Watch button must have:

Light/vibrant green background.

White text.

Strong accessible contrast.

Rounded premium geometry.

Extremely clear hover/focus/touch state.

Fast press animation.

Subtle depth.

Cards must have several variants while preserving the same design language:

Standard media card.

Landscape video card.

Portrait/show artwork card.

Compact list card.

Continue-watching card.

Featured editorial card.

Premium card.

Live card.

News card.

Creator card derivative.

Smartwatch micro-card.

Television 10-foot-interface card.

Use intelligently responsive layouts rather than merely shrinking desktop cards.

4. RESPONSIVENESS — SMARTWATCH TO TELEVISION

The interface must dynamically adapt across an unusually broad range of viewport classes.

Design from approximately 200px-wide smartwatch displays through 4K television displays.

Treat responsiveness as an architectural requirement rather than a few CSS media queries.

Use:

Fluid typography.

clamp().

CSS Grid.

Flexbox.

Container queries where useful.

Responsive spacing tokens.

Responsive radius tokens.

Fluid media ratios.

Adaptive navigation.

Adaptive content density.

Progressive enhancement.

Capability detection.

Pointer/hover media queries.

Orientation handling.

Safe-area insets.

Responsive images.

Use approximate behavioural classes for:

200–319px: smartwatch / micro-screen.

320–479px: compact mobile.

480–767px: large mobile.

768–1023px: tablet.

1024–1439px: laptop.

1440–1919px: desktop.

1920–3839px: large monitor / television.

3840px+: 4K display.

For smartwatch-sized layouts:

Remove decorative clutter.

Present essential content only.

Use extremely concise cards.

Use one primary interaction per visible unit.

Avoid horizontal overflow.

Simplify navigation dramatically.

Keep player controls understandable.

For televisions:

Implement a true 10-foot viewing experience.

Increase type scale and interaction targets.

Create strong focus states.

Allow sensible keyboard/D-pad style navigation.

Keep important interface elements within television-safe visual zones.

Avoid dense tiny text.

Use cinematic artwork.

Allow multi-column content rails.

Do not simply stretch desktop layouts to TV dimensions.

5. THEMES

Implement all three:

Light

Dark

System / Device

System mode must respond to the operating system preference.

Persist explicit user preference locally and, when authentication exists, make the preference compatible with future account persistence.

The themes should feel individually art-directed.

Dark should not simply invert light.

Light should use elegant warm neutral surfaces alongside green and gold.

Dark should feel cinematic.

Premium should have an enhanced interpretation of both modes.

Avoid theme-change flashing during application initialization.

6. 3D VISUAL DESIGN

Incorporate tasteful three-dimensional imagery and interaction.

Potential 3D visual language:

Studio microphone.

Headphones.

Audio waveform sculptures.

Floating podcast artwork.

Broadcasting rings.

Voice frequency forms.

Floating glass panels.

Layered speaker cones.

Audio wave particles.

Dimensional Voice Lounge logo treatments.

Studio environments.

Golden premium objects.

Use true WebGL/Three.js techniques only where they meaningfully enhance the experience and do not compromise performance.

Where full 3D is unnecessary, create depth with CSS perspective, layered images, transforms, lighting, parallax and shadows.

3D assets must be progressively loaded.

Low-powered devices must receive a lighter equivalent.

Decorative 3D must never delay the user's ability to browse or play content.

Respect prefers-reduced-motion.

7. MOTION LANGUAGE

Motion must feel fast.

The purpose of animation is to increase perceived responsiveness, not make the experience theatrical or slow.

Favor approximately:

100–160ms for direct interaction feedback.

160–220ms for normal interface transitions.

220–320ms only for larger spatial transitions.

Use:

Transform.

Opacity.

GPU-friendly effects.

Spring-like microinteraction where appropriate.

Small card lift.

Thumbnail zoom.

Press compression.

Directional page transitions.

Animated progress indicators.

Fast menu reveals.

Smooth player expansion.

Skeleton shimmer.

Subtle parallax.

Shared-element style transitions where practical.

Never make a user wait for an animation before being able to interact.

Avoid slow 800ms–1500ms marketing animations.

The website should psychologically feel immediate.

8. SKELETON LOADING AND NETWORK LATENCY

Every data-driven section must have a polished skeleton state.

Do not use generic centered spinners as the primary loading pattern.

Create skeleton versions of:

Media cards.

Hero banners.

Rows/carousels.

News cards.

Creator cards.

Episode lists.

Search results.

Profile information.

Comments/community sections.

Premium components.

Player metadata.

Images.

Skeleton shapes should closely match their eventual content.

Prevent layout shift when data arrives.

For slow connections, maintain existing usable content while fetching new content whenever possible.

Add graceful:

Loading states.

Empty states.

Offline states.

Retry states.

Error states.

Partial-content states.

9. PERFORMANCE REQUIREMENTS

Treat performance as part of the visual design.

Aim for excellent Core Web Vitals on realistic mobile hardware.

Target approximately:

LCP ≤ 2.0 seconds where practical.

INP ≤ 150ms where practical.

CLS ≤ 0.05.

Use intelligent:

Route-level code splitting.

Component lazy loading.

Image lazy loading.

AVIF/WebP where appropriate.

Responsive image sizing.

Hero preloading.

Asset compression.

Tree shaking.

Caching.

Prefetching.

Route prefetching.

Predictive loading where sensible.

Content virtualization for very long lists.

content-visibility where beneficial.

Memoisation only where useful.

Font subsetting or optimized font loading.

Deferred non-critical scripts.

Streaming/data-loading capabilities available in the selected stack.

Avoid unnecessarily shipping 3D libraries to routes that do not use them.

Avoid loading entire media catalogues into the DOM.

Interactions should respond immediately even while network requests continue.

10. GLOBAL MEDIA PLAYER

Create a high-quality persistent player architecture.

It should support audio and video media.

The user should be able to begin content on one route and continue navigating without unexpectedly losing playback.

Support:

Play.

Pause.

Seek.

Elapsed time.

Remaining time.

Volume.

Mute.

Playback speed.

Next.

Previous.

Queue.

Episode information.

Artwork.

Video fullscreen.

Picture-in-picture when supported.

Captions where supported.

Transcript shortcut.

Favourite/save.

Share.

Continue listening.

Mini-player.

Expanded player.

Mobile bottom player.

Desktop persistent player.

TV-friendly expanded mode.

Use realistic mocked media where actual Voice Lounge media is unavailable.

Do not embed copyrighted commercial media without appropriate rights.

Architect media sources so real streaming URLs can later replace mock URLs without redesigning the player.

11. INFORMATION ARCHITECTURE

Create exactly 15 primary routes.

Every route must contain exactly 20 meaningful page sections.

The global navigation shell, global header, persistent player and global footer do not count toward the required 20 sections.

That means the platform contains 300 route-level content sections in total.

These sections must be modular, responsive and progressively loaded so the requirement does not create an unmanageable initial page load.

Do not create repetitive filler merely to reach 20 sections.

Every section needs a clear editorial, discovery, utility, commerce or engagement purpose.

The 15 routes and their required 20 sections are:

/ — Home. Sections: 01 Cinematic Hero; 02 Trending Now; 03 Editor's Picks; 04 New This Week; 05 Continue Watching/Listening; 06 South Africa Top 10; 07 Featured Podcast; 08 Browse Categories; 09 Most Watched Videos; 10 Creator Spotlight; 11 Latest Full Episodes; 12 Short Clips; 13 Language Spotlight; 14 Latest Voice Lounge News; 15 Live and Upcoming; 16 Hidden Gems; 17 Premium Membership Teaser; 18 Community Favourites; 19 Newsletter/Follow The Voice CTA; 20 Final Discovery Gateway.

/discover — Discovery. Sections: 01 Discovery Hero; 02 Recommended For You; 03 Choose Your Mood; 04 Browse by Topic; 05 Browse by Format; 06 Browse by Language; 07 Browse by Province/Region; 08 Trending Discovery; 09 Recently Added; 10 Hidden Gems; 11 Binge-Worthy Series; 12 Under 20 Minutes; 13 Deep-Dive Episodes; 14 Video-First Podcasts; 15 Audio-First Podcasts; 16 Live Replay Collections; 17 Curated Editorial Collections; 18 Rising South African Creators; 19 Unexpected Cross-Genre Picks; 20 Surprise Me Discovery Engine.

/podcasts — Podcast Directory. Sections: 01 Directory Hero; 02 Featured Podcasts; 03 Trending Podcasts; 04 New Podcast Launches; 05 Podcast Charts; 06 Business and Entrepreneurship; 07 Culture and Society; 08 Sport; 09 Technology; 10 Comedy; 11 News and Current Affairs; 12 Music and Entertainment; 13 Education; 14 Health and Lifestyle; 15 Faith and Spirituality; 16 Family; 17 African Stories; 18 Branded Podcasts; 19 Independent Creators; 20 Complete Filterable Podcast Directory.

/shows — Shows. Sections: 01 Shows Hero; 02 Featured Original Show; 03 Trending Shows; 04 Voice Lounge Originals; 05 Interview Shows; 06 Talk Shows; 07 Panel Shows; 08 Culture Shows; 09 Business Shows; 10 Sports Shows; 11 Entertainment Shows; 12 Lifestyle Shows; 13 Documentary Series; 14 New Seasons; 15 Returning Shows; 16 Binge Collections; 17 Hosts to Watch; 18 Behind the Scenes; 19 Audience Favourites; 20 All Shows Explorer.

/episodes — Episodes. Sections: 01 Episode Hero; 02 Latest Episodes; 03 Trending Today; 04 Most Played This Week; 05 Continue Listening; 06 Recommended Episodes; 07 Short Episodes; 08 Long-Form Conversations; 09 Interviews; 10 Debates and Panels; 11 Storytelling; 12 Business Conversations; 13 Sports Conversations; 14 Culture Conversations; 15 Entertainment Conversations; 16 Technology Conversations; 17 Staff Picks; 18 Listener Favourites; 19 Recently Updated Episodes; 20 Infinite Episode Explorer.

/watch — Video Hub. Sections: 01 Cinematic Video Hero; 02 Continue Watching; 03 Latest Video Podcasts; 04 Trending Video; 05 Full Episodes; 06 Interviews; 07 Studio Sessions; 08 Highlight Reels; 09 Short Clips; 10 Behind the Scenes; 11 Creator Diaries; 12 Most Watched This Week; 13 Recently Added; 14 Live Replays; 15 Video Originals; 16 Culture Video; 17 Business Video; 18 Sport Video; 19 Recommended For You; 20 Complete Video Library.

/live — Live Programming. Sections: 01 Live Hero/On Air State; 02 Currently Live; 03 Starting Soon; 04 Today's Schedule; 05 This Week's Schedule; 06 Featured Live Event; 07 Live Podcast Recordings; 08 Live Interviews; 09 Live Panels; 10 Live Entertainment; 11 Live Sport Discussions; 12 Live Business Conversations; 13 Audience Q&A Events; 14 Creator Live Rooms; 15 Upcoming Premieres; 16 Set Reminder; 17 Past Live Replays; 18 Live Community Reactions; 19 Live FAQ/How It Works; 20 Live Programming CTA.

/categories — Categories. Sections: 01 Category Explorer Hero; 02 Trending Categories; 03 Business; 04 Entrepreneurship; 05 Technology; 06 Sport; 07 Music; 08 Entertainment; 09 Comedy; 10 Society and Culture; 11 News; 12 Education; 13 Lifestyle; 14 Health and Wellness; 15 Relationships; 16 Faith and Spirituality; 17 African Stories; 18 Youth and Campus; 19 Emerging Categories; 20 All Categories A–Z.

/creators — Creators and Hosts. Sections: 01 Creator Hero; 02 Featured Creator; 03 Trending Creators; 04 Rising Voices; 05 Women in Podcasting; 06 Independent Creators; 07 Voice Lounge Hosts; 08 Business Voices; 09 Sports Voices; 10 Entertainment Voices; 11 Culture Voices; 12 Technology Voices; 13 Creator Video Stories; 14 Creator Interviews; 15 Creator Playlists; 16 New Creator Arrivals; 17 Most Followed; 18 Creator Community; 19 Become a Voice Lounge Creator; 20 Creator Directory.

/news — Latest News and Editorial. Sections: 01 News Hero; 02 Breaking/Latest; 03 Voice Lounge Announcements; 04 Podcast Industry News; 05 South African Entertainment; 06 Creator News; 07 Media Industry; 08 Business; 09 Technology; 10 Culture; 11 Music; 12 Film and Television; 13 Sport and Media; 14 Interviews; 15 Opinion and Analysis; 16 Features; 17 Trending Stories; 18 Most Read; 19 Newsletter Subscription; 20 Complete News Archive.

/search — Universal Search. Sections: 01 Search Hero/Input; 02 Intelligent Suggestions; 03 Recent Searches; 04 Trending Searches; 05 Top Result; 06 Podcast Results; 07 Episode Results; 08 Video Results; 09 Show Results; 10 Creator Results; 11 Category Results; 12 News Results; 13 Live Results; 14 Search by Language; 15 Search by Duration; 16 Search by Date; 17 Search by Popularity; 18 Related Searches; 19 No-Result Discovery State; 20 Full Filterable Result Explorer.

/premium — Voice Lounge Premium. Sections: 01 Ultra-Luxury Premium Hero; 02 Instant Premium Preview; 03 Membership Tier Presentation; 04 Premium Originals; 05 Ad-Free Experience; 06 Early Access Content; 07 Exclusive Video; 08 Premium Audio Quality; 09 Offline/Save Experience Concept; 10 Premium Creator Rooms; 11 Curated Member Collections; 12 Personalised Concierge Discovery; 13 Multi-Device Experience; 14 Member Profile Experience; 15 Premium Community Access; 16 Member Benefits/Partner Perks; 17 Premium Testimonials; 18 Free vs Premium Comparison; 19 Premium FAQ and Mock Checkout Interface; 20 Final Join Premium CTA.

/community — Community. Sections: 01 Community Hero; 02 Trending Discussions; 03 Listener Reactions; 04 Episode Conversations; 05 Creator Conversations; 06 Community Polls; 07 Recommendations; 08 Listener Playlists; 09 Community Top Picks; 10 Fan Clubs; 11 Upcoming Community Events; 12 Live Q&A; 13 Listener Stories; 14 Creator Responses; 15 Community Challenges; 16 Top Contributors; 17 Community Guidelines; 18 Join/Sign-In CTA; 19 Community Newsletter; 20 Explore All Discussions.

/about — About The Voice Lounge. Sections: 01 Brand Manifesto Hero; 02 What Is The Voice Lounge; 03 Our Mission; 04 Our Vision; 05 Why South African Voices Matter; 06 Our Story; 07 Voice Lounge Timeline; 08 Our Editorial Philosophy; 09 Our Studios; 10 Our Technology; 11 Our Audience; 12 Our Creators; 13 Our Team; 14 Partnerships; 15 Advertise With Us; 16 Press and Media; 17 Careers; 18 Social Impact; 19 Contact/Business Enquiries; 20 Build the Future of African Audio CTA.

/account — User Account. Sections: 01 Account/Profile Hero; 02 Profile Details; 03 Continue Listening; 04 Continue Watching; 05 Following; 06 Saved Podcasts; 07 Saved Episodes; 08 Saved Videos; 09 Watch Later; 10 Listening History; 11 Viewing History; 12 Personal Playlists; 13 Recommendations Settings; 14 Notification Preferences; 15 Language Preferences; 16 Theme and Appearance; 17 Device Management UI; 18 Premium Membership Status; 19 Privacy/Data Controls; 20 Account Security and Sign-Out.

Implement all 15 routes.

Do not merge routes.

Do not omit sections.

Do not reduce the route count because the site is large.

Architect components and data intelligently so the system remains maintainable.

12. GLOBAL NAVIGATION

Desktop navigation should be premium, clear and discovery-oriented.

Provide logical access to:

Home.

Discover.

Podcasts.

Shows.

Episodes.

Watch.

Live.

Categories.

Creators.

News.

Premium.

Search.

Account.

On smaller screens use a high-quality mobile navigation pattern.

Do not cram 15 destinations into a tiny horizontal navbar.

Use hierarchy.

Search should remain easily accessible.

The persistent player must not obstruct navigation.

For televisions, provide focus-based navigation appropriate for remote control.

13. HOMEPAGE HERO

The homepage must immediately establish The Voice Lounge as a major media company.

Avoid a generic SaaS-style hero.

Create something cinematic.

Potential composition:

Large featured video/podcast artwork.

Dimensional microphone or waveform object.

Bold editorial typography.

Current featured episode.

Fast Watch CTA.

Secondary Explore Podcasts CTA.

Subtle content statistics.

Floating media artwork.

Background depth.

Green/gold lighting.

Animated soundwave.

Include enough visual sophistication that the homepage feels like the front door to a serious entertainment platform.

14. PREMIUM EXPERIENCE

The /premium route must feel noticeably more luxurious than the rest of the product.

Do not merely turn everything gold.

Premium visual principles:

More negative space.

Higher image quality.

More elegant typography.

Deeper blacks.

Controlled metallic gold.

Sophisticated gradients.

Subtle glass.

Premium motion.

Exceptional layout precision.

Museum-like content curation.

High-end editorial photography.

Dimensional product presentation.

Minimal clutter.

Use a visual language inspired by high-end entertainment and luxury editorial design rather than typical subscription pricing pages.

The Premium experience should also feel faster.

Achieve this through:

Prefetched likely interactions.

Immediate hover/focus feedback.

Aggressive but responsible asset optimisation.

Small fast transitions.

Pre-rendered skeletons.

Instant tab switching.

Optimistic interface feedback.

Carefully deferred decorative media.

Persistent cached assets.

Priority loading of the primary visible premium experience.

The user should psychologically perceive Premium as exceptionally refined and immediate.

This is a mock premium experience.

Build the full polished premium interface and mock checkout flow, but do not process real payments unless an explicitly configured payment infrastructure is already available and authorised.

15. CONTENT AND DATA MODEL

Create a maintainable content architecture supporting at least these entities:

Podcast.

Show.

Episode.

Video.

Creator.

Category.

NewsArticle.

LiveEvent.

Playlist.

Collection.

UserProfile.

Follow.

Favourite.

HistoryEntry.

QueueItem.

SubscriptionPlan.

NotificationPreference.

Where a production-capable database/backend integration such as Supabase is available, use it appropriately.

Create sensible schema relationships.

Seed the site with realistic South African-oriented demonstration content.

Do not fill the interface with “Lorem ipsum.”

Create believable show names, descriptions, episode metadata and editorial headlines.

Clearly keep mock data fictional where appropriate.

Structure the data layer so real Voice Lounge content can replace seeded content without redesigning the frontend.

16. SOUTH AFRICAN CONTEXT

The platform should clearly belong to South Africa.

Use South African English conventions where appropriate.

Use dates, locations and editorial references appropriately.

Support the future addition of South African languages such as:

isiXhosa.

isiZulu.

Sesotho.

Setswana.

Afrikaans.

English.

Do not stereotype cultures.

Do not reduce South African identity to generic flags, wildlife imagery or clichés.

Express the market through voices, creators, cultural diversity, language, cities, stories, design confidence and editorial relevance.

Prepare the architecture for broader African expansion without changing the immediate South African positioning.

Currency-related mock premium prices, where displayed, should use ZAR / R.

17. SEARCH

Create a convincing universal search experience.

Search across:

Podcasts.

Shows.

Episodes.

Videos.

Creators.

News.

Categories.

Live events.

Use debounced input.

Show helpful immediate suggestions.

Provide keyboard navigation.

Create filters.

Create sensible ranking.

Highlight matching terms where useful.

Provide useful empty states rather than “No results.”

Search on mobile must feel just as powerful as desktop.

18. PERSONALISATION

Create frontend architecture and mock states supporting:

Recommended for you.

Because you watched.

Because you listened.

Continue watching.

Continue listening.

Following.

Saved content.

Watch later.

Recently played.

Preferred categories.

Preferred languages.

Personal playlists.

Do not falsely imply AI is operating where no recommendation system exists.

Mock recommendation results realistically and make the architecture ready for a future recommendation backend.

19. AUTHENTICATION AND ACCOUNT

If supported by the chosen backend, prepare real authentication architecture.

Support:

Email/password.

Future social providers.

Signed-out state.

Signed-in state.

Protected account data.

Session handling.

Account menu.

Password recovery.

Profile settings.

If full authentication cannot be safely configured without credentials, implement the polished interface and clean integration points rather than pretending authentication is live.

Never expose secrets.

20. NEWS EXPERIENCE

News should feel like a professional digital publication, not an afterthought.

Create:

Article cards.

Hero stories.

Featured stories.

Category tagging.

Author display.

Publication dates.

Reading time.

Related content.

Share controls.

Responsive article typography.

Inline podcast/video recommendations.

News-to-podcast cross-discovery.

Support future article detail routing even if the 15 listed routes remain the primary top-level routes.

Dynamic detail routes may exist underneath primary routes when needed; they do not count as additional primary navigation routes.

21. DETAIL EXPERIENCES

Build reusable detail templates for:

Podcast detail.

Episode detail.

Video detail.

Creator detail.

Show detail.

News article detail.

Category detail.

Live event detail.

These may use dynamic nested routes.

Provide strong cross-linking so no content page becomes a dead end.

Each content detail should offer related recommendations.

22. ACCESSIBILITY

Aim for WCAG 2.2 AA.

Implement:

Semantic HTML.

Correct heading hierarchy.

Keyboard navigation.

Visible focus states.

Screen-reader labels.

Alternative text.

Accessible dialogs.

Accessible drawers.

Accessible carousels.

Accessible media controls.

Caption support.

Transcript architecture.

Reduced-motion behaviour.

Colour contrast validation.

Touch target sizing.

Form labels.

Error announcement.

Skip navigation.

Do not use colour as the sole representation of state.

The green Watch button with white text must be tuned to preserve useful visual accessibility despite the intentionally vibrant brand treatment.

23. SEO AND DISCOVERABILITY

Implement strong metadata architecture.

Include:

Unique page titles.

Meta descriptions.

Canonical architecture.

OpenGraph.

Social cards.

Robots configuration where appropriate.

Sitemap architecture.

Semantic headings.

Structured content.

Use relevant schema.org structured data where appropriate, including concepts such as:

PodcastSeries.

PodcastEpisode.

VideoObject.

NewsArticle.

Person.

Organization.

BreadcrumbList.

WebSite SearchAction where appropriate.

The website should be designed to rank for South African podcast discovery queries over time.

24. PRIVACY AND SOUTH AFRICAN COMPLIANCE

Prepare the website for responsible privacy practices and POPIA-related requirements.

Include appropriate concepts for:

Privacy policy.

Cookie preferences.

Analytics consent where legally appropriate.

Marketing preferences.

Data controls.

Account deletion request flow architecture.

Export-my-data architecture.

Secure handling of user information.

Do not fabricate legal guarantees.

Use appropriate placeholder legal content where final lawyer-approved copy will later be required.

25. ANALYTICS ARCHITECTURE

Create an analytics event abstraction ready to connect to the eventual analytics provider.

Useful events include:

Podcast impression.

Card click.

Watch click.

Play.

Pause.

25% listened.

50% listened.

75% listened.

Completed.

Video play.

Search.

Follow.

Unfollow.

Save.

Share.

Premium view.

Premium CTA click.

Newsletter signup.

News article open.

Live reminder.

Do not hard-code unnecessary third-party tracking scripts if credentials/configuration are unavailable.

26. DESIGN SYSTEM

Create reusable primitives rather than page-specific duplicated CSS.

At minimum define systems for:

Typography.

Colour.

Spacing.

Grid.

Breakpoints.

Container widths.

Borders.

Radii.

Shadows.

Blur.

Glass.

Motion.

Z-index.

Icons.

Buttons.

Inputs.

Tabs.

Chips.

Badges.

Cards.

Navigation.

Drawers.

Dialogs.

Tooltips.

Carousels.

Skeletons.

Media controls.

Pagination.

Toast feedback.

Empty states.

Error states.

Theme tokens.

Use component variants instead of copying components repeatedly.

27. TYPOGRAPHY

Typography must feel modern, editorial, premium and highly legible.

Use strong hierarchy.

Allow large editorial headlines.

Use responsive clamp() sizing.

Keep body copy readable.

Avoid making every heading uppercase.

Use tighter display tracking where appropriate.

Use typography as a significant part of the brand.

Do not load excessive font families or font weights.

Optimise font delivery.

28. CAROUSELS AND CONTENT RAILS

Streaming products naturally use horizontal content discovery, but do not make every section identical.

Mix:

Carousels.

Editorial grids.

Asymmetric grids.

Feature cards.

Ranked lists.

Compact rows.

Hero features.

Split layouts.

Creator profiles.

Article layouts.

Full-bleed sections.

On touch screens support natural horizontal gestures.

On desktop offer visible controls when required.

On televisions support focus navigation.

Never hide essential content behind hover-only interactions.

29. IMAGERY

Use sophisticated imagery throughout.

Artwork should feel editorial and entertainment-focused.

Establish consistent thumbnail aspect ratios.

Avoid low-resolution stretching.

Where final media assets are unavailable, use high-quality temporary imagery that can easily be replaced.

Use responsive sources.

Reserve space before image loading.

Lazy-load offscreen images.

Provide meaningful alt text.

Never create visual dependence on stock watermarks.

30. MICROINTERACTIONS

Add premium interaction polish to:

Watch buttons.

Play buttons.

Cards.

Follow controls.

Save controls.

Tabs.

Navigation.

Search.

Volume.

Progress bars.

Theme switcher.

Premium CTA.

Accordion FAQ.

Live indicators.

Notifications.

Player expansion.

Skeleton completion.

Do not create interaction noise.

Every effect should communicate something.

31. LIVE STATES

Live content requires distinct visual treatment.

Use:

Subtle live indicator.

Current viewer/listener count mock architecture.

Starting-soon state.

Reminder state.

Ended state.

Replay state.

Schedule.

Countdown where appropriate.

Do not create aggressive flashing animations.

32. NEWSLETTER AND SOCIAL FOLLOWING

Provide polished conversion components for following The Voice Lounge.

Include newsletter capture UI.

Validate form states.

Include social platform placeholders appropriate to the brand.

Do not create fake follower numbers presented as verified facts.

33. ERROR AND EMPTY STATES

Build polished states for:

Failed fetch.

No internet.

Empty search.

No saved items.

No history.

No followed creators.

No live content.

Media unavailable.

Premium feature unavailable.

Account signed out.

Every empty state should help the user take a productive next step.

34. OFFLINE/PWA READINESS

Where appropriate, make architecture compatible with progressive web application behaviour.

Provide sensible app metadata.

Avoid caching strategies that could cause stale critical news or account data.

Media downloads can remain a conceptual premium capability unless the implementation can support them correctly.

35. SECURITY ENGINEERING

Never expose secrets in frontend code.

Sanitise user-generated fields.

Use secure database access patterns.

Use row-level security when applicable.

Validate inputs.

Avoid unsafe HTML rendering.

Use least-privilege principles.

Handle authentication state securely.

Do not store sensitive information unnecessarily.

36. CODE QUALITY

Use TypeScript strongly where the environment supports it.

Avoid any unless unavoidable.

Use clear naming.

Keep components manageable.

Extract reusable logic.

Avoid giant monolithic page files.

Create route-level composition from reusable section components.

Create data adapters so the presentation layer is not tightly coupled to mock content.

Avoid premature abstraction while eliminating obvious duplication.

No console errors.

No repeated React key warnings.

No broken imports.

No inaccessible interactive div elements where semantic buttons/links should be used.

37. EXPECTED PROJECT STRUCTURE

Create clean conceptual separation between:

Application shell.

Routes.

Page sections.

UI primitives.

Media components.

Content cards.

Player.

Data services.

Hooks.

State.

Theme.

Utilities.

Types.

Assets.

Animations.

Authentication.

Analytics abstraction.

Testing.

Backend integration.

Use the conventions of the selected framework rather than forcing an unnatural folder layout.

38. INTERACTION REQUIREMENTS

All visible primary actions should do something meaningful.

Do not ship dead buttons.

Watch should open/play the associated content.

Play should play media.

Follow should visibly update state.

Save should visibly update state.

Search should search.

Filters should filter.

Theme controls should change themes.

Navigation should navigate.

Premium CTA should reach the mock premium conversion flow.

Newsletter UI should validate input and show a success/error state.

If an interaction is intentionally unavailable because it needs a future third-party service, make that state clear and graceful.

39. PLAYER PERSISTENCE

Playback persistence is critical.

Where technically practical:

Do not reset active playback during ordinary route navigation.

Retain position.

Retain queue.

Retain volume.

Retain playback speed.

Remember recent listening locally.

Restore useful state following refresh where appropriate.

Do not unexpectedly autoplay after page load.

Respect browser media policies.

40. SMART LOADING STRATEGY

Above-the-fold content receives priority.

Below-the-fold content loads progressively.

Predictively prefetch content when user intent is strong, for example:

Hovering or focusing a detail card.

Opening navigation.

Approaching the end of a content row.

Selecting search suggestions.

Navigating from a podcast to likely episode pages.

Do not waste bandwidth on low-end/mobile devices.

Use connection-awareness where browser support makes this sensible.

41. PREMIUM SPEED PERCEPTION

Premium should communicate exclusivity partly through responsiveness.

Use:

Preloaded premium navigation assets.

Fewer layout shifts.

Instant interactive feedback.

Cache-first treatment for static premium visuals.

Optimised image payloads.

Intent prefetching.

Very short transitions.

Minimal blocking JavaScript.

Prioritised main content.

The premium interface must feel exceptionally composed, controlled and fast.

Do not simulate speed by displaying fake performance statistics.

42. EDITORIAL QUALITY

Avoid generic AI-style marketing language repeated everywhere.

Content should sound like a real South African entertainment/media brand.

Headlines should vary.

Descriptions should vary.

Do not overuse phrases like:

“Dive into…”

“Discover a world of…”

“Unlock…”

“Elevate your…”

Write concise editorial microcopy.

The brand voice should be:

Confident.

Contemporary.

Warm.

Knowledgeable.

Culturally aware.

Premium without being pretentious.

43. NO GENERIC TEMPLATE AESTHETIC

Actively avoid the typical generated-site appearance:

Do not use the same rounded rectangle for every section.

Do not use identical three-column feature grids everywhere.

Do not put gradient blobs behind every heading.

Do not overuse pills.

Do not overuse centred headings.

Do not make every section perfectly symmetrical.

Do not fill the site with generic outline icons.

Do not turn the homepage into a SaaS landing page.

This is an entertainment and media platform.

Use strong editorial composition.

44. FOOTER

Create a substantial responsive footer supporting:

Brand statement.

Explore.

Podcasts.

Shows.

Watch.

Creators.

News.

Premium.

About.

Careers.

Advertising.

Partnerships.

Contact.

Privacy.

Terms.

Cookie settings.

Accessibility.

Social channels.

Newsletter.

Copyright.

The footer is global and is not included in each route's required 20-section count.

45. TESTING REQUIREMENTS

After implementation, actively inspect and test the website.

Test important flows at representative viewport widths including approximately:

220px.

320px.

375px.

430px.

768px.

1024px.

1440px.

1920px.

3840px where practical.

Test portrait and landscape where relevant.

Check:

Navigation.

Card wrapping.

Content overflow.

Theme switching.

Player behaviour.

Search.

Watch interactions.

Focus order.

Keyboard control.

Animations.

Reduced motion.

Skeleton loading.

Missing image behaviour.

Slow network state.

Empty state.

404 behaviour.

Console errors.

Layout shift.

TV readability.

Smartwatch legibility.

Do not consider the task complete merely because the application compiles.

Visually inspect it.

Fix obvious quality problems you discover.

46. ACCEPTANCE CRITERIA

The finished implementation is only acceptable if all of the following are true.

There are exactly 15 primary routes.

Every primary route contains exactly 20 meaningful sections excluding the global shell, creating 300 route-level sections.

The media card is the dominant reusable content component.

Cards contain thumbnail, title, description and Watch action where appropriate.

The primary Watch button uses the required green background and white text.

The website supports light, dark and system themes.

The site meaningfully adapts from smartwatch widths to television displays.

The platform contains functional audio/video media interaction.

A persistent player exists.

Skeleton loading exists throughout asynchronous interfaces.

Animations are polished and fast.

3D imagery/depth is present without destroying performance.

The Premium route is significantly more luxurious and curated.

The Premium experience has particularly strong perceived performance.

The site includes podcasts, episodes, video, shows, creators, news, categories, live programming, search, community and accounts.

The website is clearly South African.

The implementation is responsive.

Accessibility is treated seriously.

SEO foundations are implemented.

The project has no obvious console errors.

Navigation is functional.

Primary buttons are not decorative dead ends.

Mock content feels credible.

The design does not look like a generic template.

The result feels like a commercially serious entertainment platform rather than a startup demo.

47. FINAL AGENT INSTRUCTION

Operate with maximum design and engineering ambition.

Use every suitable skill and resource available in the environment.

Make strong design decisions without repeatedly asking for approval.

If a minor detail has not been specified, choose the solution that best reinforces The Voice Lounge as an elite South African media platform.

Do not reduce scope to make implementation easier.

Do not return only a plan.

Do not return only code snippets.

Do not stop with a wireframe.

Do not call the result a prototype.

Do not produce an MVP-looking interface.

Build the website.

Populate it.

Connect its interactions.

Make it responsive.

Optimise it.

Animate it.

Test it.

Visually inspect it.

Correct defects.

Polish the details.

Make the standard experience excellent and the Premium experience extraordinary.

The final result should communicate:

The Voice Lounge is where South Africa listens, watches, discovers and follows the voices shaping the culture.

The moment someone lands on the site, it should feel as though they have entered the front page of the future of South African podcasting.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6ac964aa-be9b-4120-a236-a3ff10c6f521).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```


---

## Development Log — 20 September 2026, 13:06 SAST

### Gate 1 — Replace Fiction With the Researched Voice Lounge

**Directive:** Implement production-readiness Gate 1 only. This change establishes factual product/content truth from `voice-lounge-research.md` and the verified public information already collected. It deliberately does **not** implement the later Supabase CMS/backend, billing, live-stream transport, analytics sink, migration SEO or automated QA gates.

**Source-of-truth rule for this implementation:** when public research did not verify a field, the application now leaves it unknown, neutral or unavailable instead of manufacturing a value. Ambiguous fields such as the current street address, Instagram canonical account, TikTok, LinkedIn company page, podcast RSS/Spotify/Apple Podcast IDs, lifetime episode count, show-level dates/durations and most direct show-to-YouTube mappings are not guessed.

#### `src/lib/voice-lounge/organization.ts` — added
Created a central research-backed organisation record for The Voice Lounge. It defines the verified East London / Eastern Cape positioning, the “Eastern Cape's Voice, Amplified” proposition, the 1 August 2025 online-radio launch date, verified public telephone/email contacts, verified Facebook/YouTube/X profiles, confirmed Android/iOS store listings, the public seven-day-trial / R9.99-per-month premium proposition and the publicly documented multimedia operating pillars. The conflicting Baysville/Vincent street-address evidence is recorded as unresolved and is intentionally not published as a canonical address.

#### `src/lib/content/catalog.ts` — replaced generated demonstration catalogue
Removed the pseudo-random national podcast-network dataset and replaced it with research-backed Voice Lounge information. The previous fictional 24 creators, 40 podcasts, 180 generated episodes, fictional news, generated live events, artificial collections, R89/R149 plans and Naledi Mahlangu demo identity are no longer used as product truth. The catalogue now contains the public Voice Lounge programme guide, presenters named on the public schedule, 27 publicly visible on-demand catalogue items from the research, real press-development summaries, the Joshua Maponga and Beyond The Grey research-backed collections, and the verified Premium offer. Unpublished dates, durations, plays, ratings, followers and listener counts are represented as unknown/zero and are suppressed by adapters rather than surfaced as invented statistics. Four management-supplied host portraits are attached only to the confirmed identities supplied in the repository.

#### `src/lib/content/adapters.ts` — removed fabricated metrics/date logic
Removed the fixed 15 September 2026 relative-date anchor and now calculate relative time against the real current time. Unknown dates return “Date not published”. Zero/unknown durations, plays and follower counts are not presented. Podcast/show cards no longer manufacture episode totals or popularity statistics. Search now identifies the real catalogue entities as shows/presenters/press rather than the former fictional network.

#### `src/components/media/Artwork.tsx` — truth-preserving media fallback
Added a branded Voice Lounge placeholder for shows, people and press items that do not yet have approved real artwork. This prevents the existing stock-image fallback from depicting arbitrary people or scenes as if they were actual Voice Lounge presenters/programmes. Confirmed supplied portraits continue to render normally.

#### `src/components/youtube/YouTubeFeedProvider.tsx` — removed arbitrary video matching
Removed the hash-based fallback that paired any catalogue key with a random official-channel video. Catalogue/video relationships now require an exact verified YouTube ID. This prevents a real show or presenter from being visually associated with an unrelated channel upload.

#### `src/components/media/WatchButton.tsx` — require a verified playback source
Removed the previous first-episode fallback. Watch controls now require either an exact YouTube mapping or a real audio media URL. Items without verified playback are disabled with an explanatory title instead of silently opening unrelated content.

#### `src/lib/voice-lounge/page-data.ts` — real presenter imagery and factual taxonomy
Removed stock portrait substitution for presenters. Presenter cards now use the supplied confirmed portrait when available and the branded placeholder otherwise. Discovery language/province defaults were narrowed to the verified public baseline (English / Eastern Cape), research-backed categories replaced fictional technology/comedy/etc. aliases, and press sections now read from the factual press dataset.

#### `src/components/layout/Footer.tsx` — corrected public identity and links
Removed the incorrect “Built in Johannesburg” / Johannesburg-Cape Town-Durban positioning, fictional-content disclaimer, dead `href="#"` social buttons and unverified TikTok/LinkedIn/Instagram claims. The footer now identifies East London / Eastern Cape, exposes verified Voice Lounge email/telephone contacts, links only the confirmed Facebook/YouTube/X accounts, and links the verified Google Play and Apple App Store listings.

#### `src/routes/login.tsx` — removed Demo branding and false cross-device claims
Changed “Sign In to Voice Lounge Demo” to “Sign In to The Voice Lounge”. The account-benefit copy now distinguishes live authentication/membership identity from the browser-local saved library. Google sign-in copy no longer claims that playlists and saved videos are currently synchronised across devices.

#### `src/components/pages/DetailPage.tsx` — suppress invented detail-page facts
Removed generated plays, follower totals, listener counts and fabricated episode metadata from detail pages. Unknown publication dates/durations remain explicit rather than guessed. The former “demonstration editorial content” footer was replaced with a public-source research-baseline notice. Category metadata now reflects The Voice Lounge / East London context instead of “updated daily” claims.

#### `src/components/pages/RoutePanels.tsx` — research-backed About/Premium/account facts
Removed demo-profile metrics, fictional device counts, fake premium capabilities and the mock-checkout experience. Premium panels now expose only the publicly documented seven-day trial / R9.99 monthly price and benefits, while clearly stating that payment activation is not part of Gate 1. Account panels state browser-local persistence accurately. About content now explains the verified East London multimedia expansion. The former newsletter surface no longer accepts fake signups; it points users to verified social channels and native apps because no verified public newsletter was found.

#### `src/components/pages/RouteExperiences.tsx` — real programme names, no random show/video association
Removed the invented Shows list. The route now reads directly from the research-backed Voice Lounge programme catalogue. A selected programme only receives YouTube videos when the official channel title/description actually contains that programme name; otherwise the UI explicitly states that no verified mapping has been found. Podcast metadata no longer assumes unavailable fields.

#### `src/components/pages/PlatformPage.tsx` — factual hero/supporting metrics
Removed the unused demo-profile dependency. Generic hero statistics now report the actual research-backed programme-guide size, public catalogue-item count and East London home market instead of “6 ready” languages or seeded totals. Home SEO title now describes Eastern Cape radio/podcasts/video/studio rather than a generic national podcast directory.

#### `src/lib/voice-lounge/routes.ts` — corrected product positioning and section language
Rewrote route propositions around the researched organisation: East London, Eastern Cape, online radio, real programmes, official YouTube, public press, apps and the documented Premium offer. Replaced unsupported newsletter, fictional premium, follower-ranking, fictional category and generic corporate-vision labels with research-backed or neutral language while preserving the existing route/section architecture for later automation/manual visual work.

#### `src/routes/__root.tsx` — research-backed Organization schema
Updated global Organization structured data to use the existing public Voice Lounge domain, Eastern Cape area served, the researched multimedia description and only verified social profiles.

**Gate boundary:** No new Supabase content tables, CMS persistence, RLS/admin roles, payment processor, live-stream provider integration, analytics backend, RSS ingestion, SEO redirect migration or test framework is introduced in this change. Those remain later gates by directive.

