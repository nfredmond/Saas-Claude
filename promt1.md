# Comprehensive research for a revolutionary transportation planning platform

The transportation planning technology landscape is ripe for disruption. Current tools are fragmented, expensive, and inaccessible to smaller agencies — no single platform bridges demand modeling, civic engagement, construction tracking, and compliance into one unified system. This report synthesizes findings across all 10 research areas to inform the most complete platform specification possible, covering the state of every relevant technology, market gap, data source, and regulatory requirement as of early 2026.

---

## 1. Activity-based demand modeling has matured but remains underdeployed

Activity-based models (ABMs) represent a fundamental paradigm shift from traditional four-step models. Rather than modeling aggregate trips between zones, ABMs simulate **individual people making daily activity-travel decisions** — where to go, when, by what mode, and in what sequence. The tour (a chain of trips starting and ending at home) replaces the isolated trip as the basic unit, preserving logical consistency across mode, time, and destination choices.

**ActivitySim** (v1.5.1) is the dominant open-source ABM platform in North America, now administered by the Zephyr Foundation (as of 2025). Written in Python with vectorized C/C++ backends, it uses the **Sharrow** JIT compiler (v2.15.0) to approach Fortran-level speeds. Eight major agencies have deployed it in production, including PSRC (Seattle), ARC (Atlanta), CMAP (Chicago), and SANDAG (San Diego). Each consortium member contributes **$35,000/year**. Data inputs include synthetic populations (via PopulationSim), land use by TAZ, transportation networks, skim matrices in OMX format, household travel surveys, and Census/PUMS data. The roadmap includes transit crowding, long-distance travel, and combined origin-destination choice models.

**MATSim** (v2025.0) takes a different approach — a Java-based agent simulation where millions of agents learn optimal daily plans through an evolutionary algorithm across successive simulated days. Its ecosystem includes **30+ extension modules** covering autonomous vehicles, demand-responsive transit, electric vehicles, emissions, freight, and bicycle simulation. MOIA (Volkswagen) published an open-source AWS deployment in July 2025, and Arup's BitSim pipeline uses AWS Spot instances for cost-optimized cloud runs.

**POLARIS** (Argonne National Lab) uniquely integrates demand, dynamic traffic assignment, and vehicle energy consumption in a single C++ shared-memory process, handling **10 million agents in 4–6 hours**. It couples with UrbanSim (land use), Autonomie (vehicle energy), and GCAM (global energy) for cross-sector analysis. **BEAM** (LBNL/UC Berkeley) extends MATSim with reinforcement learning for agent behavior and models finite resources like ride-hail drivers and charging infrastructure.

A June 2024 paper demonstrated the first open-source **GPU-accelerated traffic simulator**, achieving **88.9× speedup** over CPU for 2.46 million vehicles. Cloud deployment (MOIA's matsim-aws, Arup's BitSim) and JIT compilation (Sharrow) are making large-scale ABMs practical for routine planning use.

**Key data requirements** for any ABM: synthetic populations with household/person attributes, employment data by sector and zone, multimodal transportation networks, travel time/cost skim matrices, household travel survey diaries, parking costs and capacities, transit fare structures, and future-year demographic/employment forecasts.

---

## 2. The planning SaaS market is consolidating fast around AI

The transportation planning SaaS market is undergoing rapid consolidation and AI integration. **Via acquired Remix** (2021) and Citymapper (2023), **Jacobs acquired StreetLight Data** (2022), and Via is preparing for IPO at **$3.5–3.8 billion valuation**. The transit software market alone is estimated at **$6.3 billion in 2025**, growing to $11.8 billion by 2032.

**Replica** has evolved into an enterprise data platform with 12+ datasets and 50+ metrics, covering multimodal transportation, demographics, and economic activity. It creates synthetic populations from ~5% mobile device samples calibrated against ground-truth counts. In 2024, it launched Safe Streets Planner (targeting SS4A grants), Road Closure Scenarios, Origin-Destination Analysis, and an Emissions Calculator. Pricing runs **mid-five to six figures annually** for metro regions, with no API or Esri integration — a significant limitation for GIS-heavy workflows.

**StreetLight Data** (now StreetLight InSight under Jacobs) processes **7+ billion trips/month** with empirical observation-based methodology validated against thousands of permanent counters. It offers 15-minute temporal granularity down to individual road segments, with API and Esri ArcGIS integration. Its connected vehicle data offering is a newer differentiator.

**Conveyal** remains the gold standard for accessibility analysis, with its open-source R5 routing engine calculating "who can reach what, and how reliably" across transit/bike/walk/car combinations. It works globally wherever GTFS and OSM data exist, making it ideal for rapid scenario iteration, but it lacks vehicle traffic or economic data.

**Via Intelligence** (launched August 2025) represents the frontier: the first vertical AI platform for public transit, featuring predictive runtimes that work on roads where buses have never operated, ridership modeling via city-scale digital twins, and a real-time scheduling engine. **Optibus** similarly deploys AI-powered scheduling optimization across 450+ cities.

### Critical market gaps a revolutionary platform could fill

The most significant gaps identified across practitioner feedback, APA reporting, and USDOT analysis are:

- **Affordable tools for small/rural agencies** — most platforms start at $50K+/year, excluding agencies that most need technology uplift
- **Integrated multimodal network analysis** — no single tool handles cars, transit, bikes, pedestrians, micromobility, and freight in one workflow
- **Community engagement integrated with analysis** — tools like Streetmix engage the public but cannot feed into analytical workflows; no platform bridges engagement → analysis → implementation
- **Land use + transportation feedback loops** — planners want "if we build this, what happens to land use, travel patterns, and equity?" in one workflow
- **AI-assisted plain-language planning** — planners want natural language queries, automated scenario generation, and impact prediction
- **Real-time + strategic planning integration** — the wall between operational tools (Swiftly) and strategic planning tools (Remix/Conveyal) persists

---

## 3. Civic engagement platforms need a generational leap

The civic engagement platform market is consolidating: **MySite Group** owns Social Pinpoint + MetroQuest, **Granicus** absorbed Bang the Table, **Polco** acquired Balancing Act, and **Gravity** acquired CoUrbanize. Yet fundamental limitations persist across all platforms.

**Social Pinpoint** leads with 40+ engagement tools, AI-driven sentiment analysis, interactive mapping (Esri/Mapbox/HERE basemaps), participatory budgeting ("Fund It"), and WCAG 2.2 Level AA compliance. Its 2023 acquisition of **MetroQuest** — the #1 tool among DOTs and MPOs with **65%+ visitor-to-participant conversion** — strengthened its transportation planning capabilities significantly.

**PublicInput** offers the strongest equity and multichannel features: SMS text surveys, voicemail auto-transcription, phone town halls, real-time multilingual closed captions in 100+ languages, and ArcGIS integration with EPA's EJSCREEN and Justice40 data. Virginia Beach saw **800% increase in engagement** using the platform.

**Konveio** occupies a unique niche in document-based engagement with an AI-powered document assistant that answers questions from within specific PDFs (not the open web), with cited sources. Its GIS-enabled digital plans with AI connectors linking map features to policy information represent an innovative bridge between documents and spatial data.

**Maptionnaire** (from Finland's Aalto University) produces the most GIS-compatible output — exports in shapefile, GeoJSON, and Excel with coordinates — making it the only platform where engagement data flows directly into professional planning workflows.

### What a next-generation civic engagement platform must include

Based on the gaps identified across all platforms, the specification should target:

- **Unified planning-engagement pipeline**: Engagement data flows as GIS layers directly into transportation models; residents prioritize transit → model re-runs → visualize impact on commute times
- **True multichannel + offline-first**: SMS surveys, voicemail transcription, IVR for non-smartphone users, paper survey OCR, QR code kiosks — all feeding one dataset with automatic language detection and real-time translation
- **AI-powered deliberation**: Beyond positive/negative sentiment to understanding policy context, identifying consensus/disagreement areas, generating "what we heard" summaries with representative quotes
- **Closed-loop transparency**: A "Decision Tracker" showing input received → how considered → decision made → why, with automated "You said, we did" reports pushed to participants
- **Equity engine**: Real-time demographic representation dashboards during live engagement with automatic gap alerts and targeted micro-outreach recommendations
- **Immersive visualization**: AI-generated before/after streetscape renderings, 3D walkthroughs of proposed projects, and AR tools for on-site visualization of proposed changes

---

## 4. Construction tracking and compliance is the most fragmented domain

Transportation construction project management suffers from the most severe tool fragmentation of any area studied. Agencies typically use **5–10 disconnected systems**: AASHTOWare for construction, B2Gnow for DBE compliance, LCPtracker for labor, e-Builder for program management, Bluebeam for plans, and separate financial/ERP systems.

**AASHTOWare Project** (AASHTO/InfoTech) is used by the majority of US state DOTs with modules for estimation, preconstruction, construction and materials management, civil rights and labor compliance, and data analytics. Its new **Asset Tracker** (July 2025) connects project data to asset inventories. However, it has a complex learning curve, limited integration with non-DOT systems, and Wisconsin DOT noted materials module implementation was delayed to 2026.

**Aurigo Masterworks** serves 12+ North American DOTs (Utah, Nevada, Hawaii, Massachusetts) and FHWA itself, offering end-to-end capital program lifecycle management with federal aid obligation/reimbursement automation and FMIS integration. It manages **$450B+ in programs** and is FedRAMP authorized.

**B2Gnow** (400+ organizations) is the industry standard for DBE compliance, tracking bidder participation up to **10 tiers deep** and generating FHWA-required semi-annual reports. **LCPtracker** handles certified payroll with 80+ validation checks and is **mandated by DOE for all IIJA-funded projects**.

The Caltrans **Local Assistance Procedures Manual** (LAPM, 2025 edition) defines all federal-aid project delivery processes across 20 chapters. Major projects ($500M+) require Project Management Plans, Initial Financial Plans, annual Financial Plan Updates within 60 days, and Cost and Schedule Risk Assessments.

### Most critical pain points for a platform to solve

- **No mainstream software tracks CEQA/NEPA milestones** through the project lifecycle; environmental commitments regularly fall through the cracks between design and construction
- **LAPM form completion remains largely PDF-based** — intelligent forms auto-populated from project data would save enormous time
- **Federal-aid compliance rules** (authorization, obligation, reimbursement, matching, period of performance) are poorly supported by general construction management software
- **Design-to-construction handoff** is broken — BIM/CAD data is disconnected from construction administration
- **Real-time program dashboards** integrating cost, schedule, compliance, and funding status require manual compilation across systems

FHWA awarded **$16.6M to 8 states in 2024** and $34M to 10 states in 2023 for Advanced Digital Construction Management Systems (ADCMS), focusing on digital as-builts, e-ticketing, and 3D models. Michigan DOT has been **99% paperless since 2014**, saving $12M/year.

---

## 5. A rich ecosystem of transportation data sources exists, mostly free

The United States maintains an extraordinarily comprehensive set of publicly available transportation data, most of it free.

**Census/ACS and CTPP** provide journey-to-work commuting patterns, mode split, and travel time at TAZ/census tract level via the Census API. **LEHD/LODES 8.3** (released November 2024) delivers block-level origin-destination employment data linking where workers live to where they work for 2002–2022 on 2020 census geography. **NHTS 2022** provides nationally representative daily travel behavior data; the redesigned **NextGen NHTS** (2024–2025) now includes passive origin-destination data derived from mobile device traces alongside traditional surveys on a biennial cadence.

**GTFS** covers 2,500+ transit agencies worldwide. The historic March 2024 adoption of **GTFS-Flex** into the main specification made demand-responsive transit (dial-a-ride, route deviation) visible to trip planners for the first time — over half of US public transit services were previously invisible. **GBFS 3.0** covers 730+ shared mobility systems in 40+ countries.

**NPMRDS** provides 5-minute interval speeds and travel times across 400,000+ NHS road segments for three vehicle classes, now updated **weekly** (increased from monthly) through a new INRIX contract through 2026. **USGS 3DEP** has achieved **98.3% nationwide LiDAR coverage**, all free and available on AWS Open Data.

**FARS** provides a complete census of all fatal motor vehicle crashes since 1975 via a REST API. The **Freight Analysis Framework (FAF5)** covers freight flows by origin, destination, commodity, and mode with projections to 2050. **HPMS** contains 100+ data elements for all US public roads.

For commercial/proprietary sources, **StreetLight** processes 7+ billion trips/month from mobile devices and connected vehicles; **Replica** creates synthetic populations from ~5% mobile device samples; **INRIX** provides global traffic data from connected cars and fleets. The **Overture Maps Foundation** (Microsoft, Meta, Amazon, TomTom) is distributing open geospatial data including buildings, places, transportation, and boundaries as GeoParquet and PMTiles.

Emerging sources include connected vehicle data (StreetLight now offers real-time CV data; USDOT's National V2X Deployment Plan allocated **$60M in grants**), the NextGen NHTS passive OD data component, and the NTD's new requirement for GTFS feeds from all transit agencies.

---

## 6. AI is transforming every aspect of transportation planning

AI applications in transportation are advancing rapidly across the full planning lifecycle, with a global market projected to grow from **$2.11B (2024) to $6.51B (2031)** at 17.5% CAGR.

**Demand forecasting** has moved to deep learning: transformer architectures like PDformer, MLCAFormer, and TDMGCN capture spatiotemporal dependencies in traffic flow; graph neural networks (HDGCN, AEST) address OD estimation with dynamic spatial features; and an optimized CNN achieved **95% accuracy** on mode choice prediction, surpassing logit models by 14–25%. Critically, research has shown ML models **spontaneously underestimate travel demand of disadvantaged populations** — a fairness-aware regularizer has been proposed to correct this bias.

**LLMs are entering transportation planning directly.** GPT-4 achieved **91% accuracy** in real-world transport decision support for congestion pricing scenarios, **86% accuracy** on GIS tasks, and **81% comprehension** of MATSim model outputs. TrafficGPT combines ChatGPT with traffic foundation models via LangChain for data processing and simulation control. The San Antonio transit agency used GPT-4 with GTFS data to optimize routes and predict demand.

**Generative AI for visualization** is a breakthrough for public engagement. MIT DUSP workshops used DALL-E 3.0 for main street revitalization visioning. UrbanistAI enables real-time participatory street design. Stable Diffusion with ControlNet has been fine-tuned to generate satellite-style images, building height maps, and land use layouts from spatial constraints. A multi-agent pipeline integrating GPT-image-1 automates bicycle infrastructure design visualization on real street-view imagery.

**Reinforcement learning for traffic signals** has shown **49% queue length reduction** and up to **68% reduction in vehicle waiting time**. Federated Deep RL achieves 45% faster convergence while preserving data privacy. Computer vision (YOLOv8) enables automated traffic counting, pedestrian/cyclist detection, and road condition assessment from existing cameras.

For safety analysis, Extra Trees classifiers achieved **96.19% accuracy** on 2.26 million Illinois crash records. TrafficSafetyGPT (a LLaMA-based model fine-tuned on government safety data) and computer vision-based surrogate safety measures from street-level video are advancing predictive crash analysis.

The landmark 55-page survey "Generative AI in Transportation Planning" (Da et al., March 2025) provides the first comprehensive framework covering descriptive, predictive, generative, simulation, and explainable tasks.

---

## 7. The modern GIS stack is now fully open-source and cloud-native

A complete, production-grade geospatial technology stack can now be built entirely from open-source components, with performance matching or exceeding commercial alternatives.

**MapLibre GL JS v5** (BSD-3 license) is the recommended map rendering engine, featuring globe projection with atmosphere shaders, Cloud Optimized GeoTIFF (COG) support, MapLibre Tiles (MLT) encoding, enhanced CJK font rendering, and video export capabilities. Sponsors include AWS, MapTiler, and Mierune, with bindings for React, Angular, and Flutter.

**Deck.gl v9.2** (October 2025) provides GPU-accelerated large-scale data visualization with early **WebGPU support**, a new widget system, and integration with MapLibre, Google Maps, and Esri. Its layer catalog spans scatterplots, arcs, paths, polygons, H3 hexagons, heatmaps, contours, point clouds, and animated trips. The CARTO module enables direct BigQuery/Snowflake/Redshift integration.

**Kepler.gl v3.2** (August 2025) adds **DuckDB integration** for in-browser SQL on large datasets, an **AI Assistant** that edits maps via text/voice/screenshot chat, raster tile layers from PMTiles and COGs via STAC, and WMS support. This architecture pattern — browser-based SQL + LLM interaction + GPU visualization — should be a core design influence.

**H3 hexagonal indexing** (Uber) divides Earth's surface into 16 resolution levels of hexagonal cells, eliminating directional bias in spatial aggregation. It's natively supported in Amazon Redshift, Snowflake, BigQuery, ArcGIS Pro 3.1+, CARTO, deck.gl, Kepler.gl, and DuckDB.

**PMTiles** (spec v3) is a single-file archive format for tiled data that serves from static cloud storage via HTTP range requests — no tile server needed. Protomaps provides daily OSM builds (~107 GB full planet), and `pmtiles extract` creates city-level extracts in ~2 MB. **Martin v1.0** (released November 2025), a Rust-based tile server in the MapLibre ecosystem, dynamically serves vector tiles from PostGIS, PMTiles, and MBTiles simultaneously.

For 3D visualization, **CesiumJS** with OGC 3D Tiles streams massive geospatial content including Google Photorealistic 3D Tiles. The digital twin market is projected to reach **$259B by 2032**. Cloud-native formats — **GeoParquet v1.1** (with spatial partitioning), **FlatGeobuf** (with built-in spatial index), and **STAC** (spatiotemporal asset catalogs) — are replacing traditional GIS server infrastructure.

### Recommended technology stack for the platform

| Layer | Technology | Role |
|-------|-----------|------|
| Database | PostgreSQL + PostGIS | Spatial data storage, analysis, ST_AsMVT |
| Analytics | DuckDB + Spatial extension | In-browser and server-side analytical queries |
| Tile Server | Martin v1.0 | Dynamic vector tiles from PostGIS + PMTiles |
| Static Tiles | PMTiles on S3/R2 | Basemaps, pre-generated datasets |
| Frontend Map | MapLibre GL JS v5 | Vector tile rendering, globe, terrain |
| Data Viz | deck.gl v9.2 | H3 hex layers, trips, heatmaps, 3D |
| Data Exploration | Kepler.gl v3.2 pattern | DuckDB + AI assistant + GPU visualization |
| 3D/Digital Twin | CesiumJS + 3D Tiles | Urban models, shadow analysis, viewsheds |
| Spatial Indexing | H3 | Hexagonal aggregation and analysis |
| Spatial Analysis | Turf.js (client), PostGIS (server) | Geometry operations |
| Data Formats | GeoParquet, FlatGeobuf, COG, PMTiles | Cloud-native storage |

---

## 8. Scenario planning tools remain siloed and expensive

**UrbanFootprint** has pivoted from pure land use scenario planning to a "Resilient Decision Intelligence Platform" covering climate, community, and urban data across **160 million parcels** nationwide. Its scenario builder lets users paint land use types onto parcels with real-time analysis of energy use, water use, accessibility, transportation, emissions, household cost, and fiscal impact. However, it has shifted focus toward utilities and insurance, with costs described as "not pocket friendly."

**Envision Tomorrow** (Fregonese Associates) remains an open-access ArcGIS extension using linked Excel spreadsheets to model individual buildings via "Prototype Builder" simplified pro formas, supporting up to 5 simultaneous scenario comparisons. **CommunityViz** (now owned by Texas A&M AgriLife, v5.2) generates up to 101 indicators via its 360 Indicators Wizard but requires ArcGIS 10.5–10.8.

**UrbanSim** has evolved into an AI-driven cloud platform with block-level templates for ~400 US MPOs, OpenStreetMap street networks for accessibility metrics, and generative AI tools for planning assistance, achieving sub-minute simulation per year for most metro areas. Its open-source UDST toolkit (Pandana for network accessibility, Synthpop for population synthesis, UrbanAccess for transit-land use analysis) provides essential components.

Best practices from FHWA and NCHRP research indicate great scenario planning tools need: rapid iteration with real-time indicator feedback, multi-metric side-by-side comparison (fiscal, environmental, transportation, equity), pre-loaded curated data to reduce startup friction, accessible interfaces for non-technical users, transparent and editable model assumptions, and integration with travel demand and accessibility modeling.

---

## 9. Emerging technologies create unprecedented integration opportunities

**MCP (Model Context Protocol)**, introduced by Anthropic in November 2024 and donated to the Linux Foundation's Agentic AI Foundation in December 2025, has become the de facto standard for AI-to-tool integration with **97M+ monthly SDK downloads** and adoption by OpenAI, Google, Microsoft, and AWS. Using JSON-RPC 2.0, it enables AI assistants to connect to GIS databases, traffic APIs, census data, transit feeds, and IoT sensors through standardized connectors. A planning platform could expose MCP servers for GTFS, MDS, GBFS, and zoning databases, allowing any AI assistant to query planning data.

**AI browser agents** (market: $5.4B in 2024, 45.8% CAGR) can autonomously collect zoning data, traffic counts, permit applications, and census data from government portals. Browser Use scored **89% on WebVoyager benchmark**; Notte outperforms it by transforming websites into structured maps for LLM consumption.

**Curb management** is rapidly digitizing. The **Curb Data Specification (CDS) v1.1** from the Open Mobility Foundation provides three APIs (Curbs, Events, Metrics) for digital curb regulation and real-time activity data. CurbIQ, Populus (100+ cities), and Automotus deploy computer vision-based monitoring. **USDOT's SMART Curb Collaborative** funds 10 cities implementing CDS. Meanwhile, the **Mobility Data Specification (MDS)** covers 115+ cities for shared vehicle management, and Seattle is piloting real-time emergency response zone communication to autonomous vehicles via the MDS Policy API.

**Vision Zero tools** center on High Injury Network (HIN) analysis — typically **3–13% of a city's streets account for 50–75% of severe/fatal crashes**. Python-based automated HIN tools using kernel density estimation, combined with equity overlays and FHWA's SS4A grant requirements, create strong demand for integrated safety analysis.

**Complete streets analysis** advanced significantly with the **SEMCOG/MDOT Multimodal Tool** (by Fehr & Peers/Blue Raster) — the first web application evaluating auto, freight, pedestrian, bike, and transit level of service on any US street, built on ArcGIS Maps SDK + React + Streetmix integration.

**Digital twins** for cities are proliferating: Virtual Singapore manages urban development and crowd flow simulation; Seoul's S-Map cut average travel times **15%**; Munich integrates mobile mapping, weather, noise, air pollution, and traffic data. Open standards (FIWARE/NGSI-LD, OGC SensorThings API) protect public investment — proprietary smart city projects cost **up to 30% more** than open-standards-based systems.

For climate resilience, **First Street Foundation** provides property-level climate risk modeling (flood, fire, heat) over 30 years, while tools like ClimateCheck and Jupiter Intelligence serve institutional users. These datasets could integrate with transportation vulnerability analysis.

---

## 10. Federal compliance is complex and varies significantly by state

Federal transportation project delivery is governed by **23 CFR** (FHWA) and **49 CFR** (FTA/DOT), requiring separate authorization for each project phase (PE, ROW, Construction) before work begins, with all spending tracked through FHWA's FMIS system.

**NEPA processing times have improved dramatically**: median EIS completion dropped from 3.6 years in 2019 to **2.2 years (26 months)** per the 2025 CEQ report, though highway EISs historically averaged over 7 years. Approximately **95% of projects qualify as Categorical Exclusions**. Eight states have full NEPA Assignment authority (California since 2007, plus Texas, Florida, Ohio, Utah, Alaska, Arizona since June 2024, and Nebraska), assuming FHWA's environmental responsibilities through MOUs.

**State environmental review laws vary enormously.** At least 17 states plus DC and Puerto Rico have comprehensive "mini-NEPAs." California's CEQA is the broadest, applying to ALL state/local agency actions with a lower threshold for requiring environmental impact reports than NEPA. Joint NEPA/CEQA documents are required for federally funded California projects. Washington's SEPA added categorical exemptions for transit-oriented development in 2025. About 30 states rely solely on NEPA for federal projects, with no state-level environmental review.

**Title VI** (49 CFR Part 21, 23 CFR Part 200) requires nondiscrimination plans, complaint procedures, public participation plans targeting minority and LEP populations, Limited English Proficiency plans based on four-factor analysis, and disparate impact analysis for major service changes. **ADA compliance** requires transition plans identifying barriers and remediation schedules; the 2023 **PROWAG guidelines** establish minimum 4-foot clear sidewalk width with no pinch points.

**Buy America requirements expanded significantly under IIJA/BABA**: all iron/steel must be melted, poured, and manufactured in the US; manufactured product domestic content thresholds increase from 55% to **75% by 2029**; and all construction material manufacturing must occur domestically. De minimis waivers apply only for projects under $500,000 or non-compliant products ≤ $1M or 5% of total costs.

**Environmental justice analysis** faces regulatory uncertainty: the Trump administration revoked EO 12898 in early 2025, though DOT's existing regulations, statutory Title VI obligations, and IIJA equity provisions remain law. The **Justice40 Initiative** directs 40% of benefits from 40 covered DOT programs to disadvantaged communities, tracked via the ETC Explorer and CEJST screening tools. The **DBE program** (49 CFR Part 26) underwent significant changes in October 2025, with interim final rules eliminating race- and sex-based certification presumptions following Supreme Court precedent.

State labor compliance varies across **28 states with prevailing wage laws** (dollar thresholds range from $1,000 to $100,000+) versus states with no such requirements. Performance measures (PM1 safety, PM2 infrastructure, PM3 system performance) require annual or biennial target-setting and reporting per 23 CFR Part 490.

### Most common compliance failures that delay projects

The top 10 failures identified across GAO reports and FHWA audits: NEPA process delays from project complexity and study obsolescence; locally administered project noncompliance ($3.8B/year, 12% of federal aid); late discovery of historic properties or park impacts triggering Section 4(f); ADA curb ramp deficiencies during resurfacing; Buy America documentation failures under new BABA rules; DBE front company/pass-through fraud; Davis-Bacon wage misclassification; projects remaining open years after completion; outdated or nonexistent LEP plans; and PE repayment triggers when projects stall for 10+ years.

---

## Synthesis: architectural implications for the platform

Across all 10 research areas, several cross-cutting themes emerge that should drive the platform specification:

**The integration opportunity is the killer feature.** No existing platform connects demand modeling → scenario planning → civic engagement → construction tracking → compliance monitoring. Building this pipeline — where a community member's preference for protected bike lanes flows through an accessibility model, into a scenario comparison, through environmental review, and into construction tracking — would be genuinely revolutionary.

**AI is the enabling technology for accessibility.** The reason small agencies can't use current tools isn't just cost — it's complexity. An AI layer powered by LLMs (connected via MCP to GTFS, Census, LODES, NPMRDS, and other data) that lets a planner ask "Show me which neighborhoods lost transit access when Route 15 was cut" and get an instant accessibility analysis would democratize planning technology.

**Open-source + cloud-native is the cost structure that makes free viable.** MapLibre + deck.gl + PostGIS + Martin + PMTiles + DuckDB provide a complete, production-grade stack at near-zero marginal cost per user. GeoParquet and FlatGeobuf eliminate traditional GIS server overhead. H3 hexagonal indexing enables efficient spatial aggregation at any scale.

**Standards compliance must be built in from day one.** The platform should natively support GTFS/GTFS-Flex/GTFS-RT, GBFS, MDS, CDS, MCP, NGSI-LD, and OGC 3D Tiles. It should expose its own MCP servers so external AI assistants can query planning data. It should generate FHWA-compliant reports (DBE semi-annual, PM1/PM2/PM3, LAPM forms) automatically from project data.

**Equity must be a core architectural principle, not an add-on.** Every analysis module should automatically flag environmental justice implications, every engagement tool should track demographic representation gaps in real time, and every scenario comparison should include equity metrics. The fairness-aware demand prediction research showing ML models underestimate disadvantaged population travel demand should inform model design.

The convergence of mature open-source ABM tools, cloud-native geospatial formats, browser-based analytical SQL (DuckDB-Wasm), AI assistants (MCP), automated data collection (browser agents), and standardized mobility data (MDS/CDS/GBFS/GTFS-Flex) creates a unique window to build the platform that planners have been waiting for — one that is comprehensive, intelligent, equitable, and free.