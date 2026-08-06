# Voice interview

**This is the file you answer.**

One recording session does two jobs at once. It fills the factual gaps that
`facts.md` can't get from your resume, and it captures how you actually talk,
which is the only reliable way to make the bot sound like you rather than like
a chatbot doing an impression of a marketer.

## How to do it

Talk, don't type. Open a voice memo app and answer these out loud as if a
recruiter asked you over coffee. Ramble. Contradict yourself. Say "honestly" and
"I mean" and trail off. All of that is signal. A typed answer comes out polished
and polished is exactly the texture we don't want, because the model already
knows how to be polished.

Twenty to thirty minutes total. Roughly a minute per question, less on some.

Then transcribe it (Descript is already in your stack) and paste the raw
transcript into `timbot/persona-transcript.md` with **no cleanup**. Leave the
filler words in. I'll pull the factual answers into `facts.md` and keep the
transcript as the style reference.

If a question doesn't apply or you'd rather not answer it, say "skip" out loud
and move on. A recorded "skip" is useful, it tells me to add that topic to the
do-not-answer list.

---

## Part 1: the gaps the resume can't fill

Every question here maps to an eval question that currently has no source. If
you skip these, the bot has to decline those questions, which is safe but
flat.

1. Walk me through why you left ConstructConnect for CEI. What were you
   actually going for?
2. Same for CEI to Implicit. You went from a business unit doing $47M to a
   small AI startup. Why?
3. You've moved three times in eight years. What would you say to someone who
   reads that as a flight risk?
4. Why are you targeting a VP or Head of Marketing seat rather than holding out
   for a CMO title?
5. What kind of company would you be a genuinely bad fit for? Be specific
   enough that it costs you something to say it.
6. What has to be true about a role on day one for you to take it?
7. What's the thing you'd want to know about a company before you said yes,
   that most candidates wouldn't think to ask?

## Part 2: how you actually work

8. Describe how you run a one-on-one. What do you actually talk about?
9. A campaign is three weeks in and underperforming. Talk me through what you do
   first, second, third.
10. Have you hired and fired people, or mostly managed projects? Tell me about a
    hire you got right and one you got wrong.
11. How do you work with sales when the relationship is bad? Not the
    theoretical answer, a time it was actually bad.
12. What does "player coach" mean on a Tuesday afternoon? What are you
    personally doing that a VP arguably shouldn't be?
13. How do you decide what not to do? You've had small teams and small budgets.
14. What's your read on when PLG is the wrong call?
15. How do you use AI tools day to day? Which ones would you be happy to be
    tested on live, and which ones have you only poked at?

## Part 3: the hard ones

These are the questions a skeptical hiring manager asks. Answering them here
is what lets the bot handle them without getting defensive.

16. What's your biggest professional failure?
17. What would your last manager say your weakness is?
18. Someone looks at the Implicit numbers, 2,500 users and two deals, and says
    that's small. What do you say back?
19. You spent three years at a services consultancy. Are you still a SaaS
    marketer?
20. Is "AI-native marketer" a real thing or is everyone saying it right now?
21. What's the part of marketing leadership you're weakest at?
22. What's something you believed about marketing five years ago that you now
    think was wrong?

## Part 4: voice and personality

Pure style capture. There are no wrong answers, the point is to get you
talking naturally for a few minutes.

23. Why did you get into marketing in the first place?
24. What's the worst marketing you've seen recently and what made it bad?
25. What do you actually do outside of work? Go past "I cook."
26. Tell me something about you that isn't on the resume.
27. What's a strong opinion you hold that most marketers would disagree with?
28. If someone spent a week working with you, what would surprise them?
29. What are you reading, building, or arguing with right now?

---

## After the transcript

Once `persona-transcript.md` exists I'll do three things with it: pull the
factual answers into the right `[FILL]` slots in `facts.md`, extract a "things
Tim would never say" list from what's absent in how you talk, and keep about
2,000 words of the raw transcript in the system prompt as the style reference.

The negative list matters as much as the positive one. Constraints bind harder
than examples.
