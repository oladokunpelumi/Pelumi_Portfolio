# The Second Map Inside a Remote Job

At 6:05 on Wednesday morning, my job scanner finished another run. It had inspected 2,046 listings, removed 216 on location, and added 21 roles to the review queue.

That was one run.

Across 14 completed runs in the week ending July 15, Career OS inspected 24,080 raw listings. Location rules removed 2,654 before any application evaluation began.

I built those rules because the word *remote* carries less information than it appears to. A listing can use the label while limiting applicants to one country, one payroll region, or a short list of US states. The work may happen from home. The employer's hiring boundary can still stop at a border.

From Lagos, that boundary shapes the whole search.

## The label and the boundary

A remote label answers a worksite question. Hiring eligibility sits in a second question: where can this company employ someone?

Those questions often share one field on a job board. A search result says *Remote*. The full description later says *Remote in Raleigh, NC*, *US only*, or *must reside in the United Kingdom*. The useful detail arrives after the broad label has already pulled the candidate in.

For a Nigerian applicant, the cost appears in small pieces. Open the role. Read the description. Check the company. Start measuring the experience match. Reach the location paragraph. Close the tab.

Repeat that across dozens of listings and the search fills with work that never had a route to an application.

I wanted the system to answer eligibility while the listing was still cheap to discard.

## What the numbers exposed

The first version of the scanner treated location as loose text. It could block an obvious country restriction, but job boards phrase domestic remote work in too many ways for a short word list.

City and state pairs were especially slippery. *San Francisco, CA, Remote* contains the desired keyword and a domestic boundary in the same string. *Remote in Raleigh, NC 27603* looks broad until the city, state, and postcode are read together.

At the same time, blunt blocking created another risk. A multi-location role might mention the United States alongside Nigeria, Africa, EMEA, or worldwide eligibility. Rejecting every string that contains a US location would throw away a valid opening.

So I defined an ordered filter and kept the word list small.

## Writing the order down

The current rule runs in 3 layers.

Always-allow terms run first. Nigeria, Lagos, Africa, EMEA, worldwide, global, and anywhere can rescue a listing whose full location string clearly includes an eligible region.

Structured blocks run second. Regular expressions catch phrases such as *Remote in*, US city and state pairs, and country-locked domestic patterns. These rules deal with the shape of the location string, which is often more useful than one isolated keyword.

The general allow list runs last. A surviving location still needs an eligible remote or regional signal before it reaches the next stage.

That order protects a phrase such as *Remote in Lagos, Nigeria* while rejecting *Remote in Raleigh, NC 27603*. The same opening word produces different outcomes because the rest of the field carries the actual boundary.

The implementation is small. The decision it protects is expensive.

## Attention is part of the system

Job-search automation is usually discussed as a speed problem. Faster discovery. Faster scoring. Faster applications.

Speed can multiply the wrong inputs.

If 100 attractive listings enter model-powered triage and 30 are closed to the candidate's location, the system spends compute and human attention explaining roles that have already failed a hard constraint. Better prose and deeper company research cannot create eligibility.

Career OS now puts the cheapest decisive checks first. Location, salary when stated, title fit, and duplicate detection run before the expensive evaluation layer. The surviving role has earned a closer read.

This changes the human experience of the queue. Every item deserves attention for a reason. The candidate can compare the work, the company, and the evidence of fit without waiting for a hidden geography clause to end the process.

The reduction matters even when the final application count stays small. Quality-capped search depends on saying no early enough to spend care later.

## A filter needs field evidence

The new mesh still has to prove itself over repeated scans.

The baseline week produced 171 triage candidates with roughly 3% converting into full evaluations. US-domestic location tags drove much of the rejection work. Over the next 2 or 3 scans, I want to see fewer of those entries reaching agent triage.

If a new format leaks through, the response is specific. Capture the string. Add a test. Tighten the expression. Run the scanner again.

That loop keeps the system honest. The filter earns trust through observed misses, recorded rules, and regression tests. A green build confirms the code behaves as written. The live queue confirms whether the written rule matches the hiring market.

From Lagos, every remote listing carries 2 maps. One shows where the work happens. The other shows who can cross the hiring boundary.

I built Career OS to read both before asking for my attention.
