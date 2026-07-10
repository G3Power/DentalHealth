# Candidate public datasets — Phase 1 shortlist

A researched shortlist of **candidate** openly-available datasets for the Phase 1 visible
indicators (`gingival-inflammation`, `plaque-tartar`, `tooth-staining`). This is discovery
output for the **public** data track — **not an approval to use anything**. It is kept in docs
(not encoded in `src/data/registry.ts`) on purpose, so no license/consent claim is treated as
authoritative until a human verifies it.

## Read this first (caveats)

- **Every license, count, and detail below is provisional** and must be re-verified on the
  primary source before any download or ingestion.
- **Repository metadata and the associated paper sometimes disagree on license.** We already
  found one such conflict (see the gingivitis set). Until resolved, assume the **stricter**
  terms apply.
- **"Open" ≠ "usable in a commercial product."** `NC` (NonCommercial) and `SA` (ShareAlike)
  terms materially affect a commercial health app; **CC BY-NC** in particular likely precludes
  commercial use.
- **A permissive license does not prove lawful provenance or subject consent**, especially for
  re-hosted / aggregated collections. Confirm the chain of consent and that images are
  de-identified. Our governance (`src/data/dataset.ts`) *requires* de-identification for
  ingested data.
- **Nothing here is ingested.** Encoding a source into `src/data/registry.ts` should happen
  only after a license + provenance review; `validateManifest` and
  `validateAnnotationForManifest` then gate it.

## Selection criteria

- **Intraoral color photographs** (what a phone camera captures) — **not** radiographs/X-rays.
- Labels relevant to a Phase 1 indicator, **or** usable as real-photo negatives / capture-quality material.
- Openly accessible, or access-by-request with a clear route.
- Adult, general-population preferred (US target market); domain shifts (pediatric, orthodontic,
  controlled studio capture) are noted as concerns.

## Best aligned with the indicators

### 1. Gingivitis Image Captioning Dataset (Hanoi Medical University)
- **Source:** Mendeley Data `10.17632/3253gj88rr.1`; paper: Data in Brief `10.1016/j.dib.2024.110960`
- **Modality/size:** intraoral RGB photos (Nikon D810), **1,096** images of the 12 anterior teeth + gingiva
- **Labels:** Modified Gingival Index (MGI) per tooth + 3 periodontist captions per image
- **License:** ⚠️ **conflict** — Mendeley shows **CC BY 4.0**, the Data-in-Brief article states **CC BY-NC 4.0** (non-commercial). Resolve with the depositor before any commercial use.
- **Indicator fit:** `gingival-inflammation` — **strong**.
- **Concerns:** license conflict; single-center; anterior teeth only; controlled studio capture (domain shift from casual selfies); non-US population.

### 2. MIO — "My Intraoral Oral Images" (Univ. Autónoma del Estado de Hidalgo)
- **Source:** Zenodo `10.5281/zenodo.20818533` (v1, 2026)
- **Modality/size:** **765** intraoral clinical photos (Canon EOS R50), adults **18–65**
- **Labels:** image-level class — healthy / gingivitis / periodontitis (evaluated by dental professionals)
- **Consent/ethics:** informed consent + IRB approval stated; images anonymized
- **License/access:** ⚠️ **files are Restricted** on Zenodo (request access); license not stated on the record. Route: request access **and** confirm terms.
- **Indicator fit:** `gingival-inflammation` — **strong**; adult general population is a good demographic fit.
- **Concerns:** access-restricted; license unknown; non-US population.

### 3. AIRC-LABDEN — plaque in fixed-orthodontic patients
- **Source:** Mendeley `10.17632/g8yhdvgjy2` (Part 1) + `10.17632/xjs4bfgzj5` (Part 2); paper: Data in Brief `10.1016/j.dib.2026.112833`
- **Modality/size:** **10,450** intraoral photos from **148** patients (9 standardized angles each) + anonymized clinical records (gingival bleeding, hygiene habits)
- **Labels:** per-tooth plaque severity (0–1, 2, 3, 4); labeled pre-staining with post-staining reference
- **License:** ⚠️ not confirmed in the metadata snapshot — **verify on Mendeley**.
- **Indicator fit:** `plaque-tartar` — strong signal, **but** ⚠️ every subject wears **fixed braces**; brackets/wires are a major domain shift and confound plaque appearance for general users.
- **Concerns:** license unverified; orthodontic-only population.

### 4. OralSDv1 — multi-modal oral disease (GitHub `enderXM249/OralSDv1`)
- **Source:** GitHub; paper "ViT-MedBERT: A Multi-Modal Transformer-Based Framework for Oral Disease Classification"
- **Modality:** oral-cavity RGB images + text symptom descriptions
- **Classes:** Caries, **Calculus (tartar/plaque)**, **Gingivitis**, **Tooth_Discoloration**, Ulcers, Hypodontia — covers **all three** Phase 1 indicators
- **License:** ⚠️ **not specified** ("contact owners before commercial or large-scale use").
- **Provenance:** ⚠️ "custom-curated" (likely aggregated); underlying image source/consent unclear.
- **Indicator fit:** highest on paper (all three) — **but unusable until license + provenance/consent are established.**

## Useful, but not for indicator labels

### 5. AlphaDent (Sosnin et al., 2025)
- **Source:** Zenodo `zenodo.org/records/16582489`, Kaggle competition `alpha-dent`, Hugging Face `ZFTurbo/AlphaDent`, GitHub `ZFTurbo/AlphaDent`
- **License:** **Apache-2.0** (permissive, commercial-friendly) per the HF dataset tag + GitHub repo — verify the Zenodo/Kaggle terms match.
- **Modality/size:** DSLR intraoral photos, **295** patients, **>1,200** images, instance-segmentation masks
- **Labels:** 9 pathology classes = Filling, Crown, **Caries (6 classes)**, and wear/abrasion. Gingiva/plaque/orthodontic parts are annotated as "objects" but are **not** among the labeled pathology classes.
- **Indicator fit:** ⚠️ **labels do not match our indicators** (it targets caries/restorations). Real value: a genuinely open source of **real intraoral RGB photos** for capture-quality + mouth-presence work and **unlabeled pretraining**, plus a modeling reference. Not indicator training data.

### 6. Varying Views of Teeth (Bharati Vidyapeeth Univ., 2024)
- **Source:** Mendeley `10.17632/6zsnhrds9t`; paper: Data in Brief `10.1016/j.dib.2024.110772`
- **Modality/size:** **9,562** intraoral images of healthy teeth, **children 1–14**
- **License:** "Creative Commons" (variant unspecified) — **verify**.
- **Indicator fit:** possible **healthy negatives** — but pediatric (strong domain shift) and non-US.

## Leads to investigate (dataset availability unconfirmed)

- **Liu et al., BMC Oral Health 2024** (`10.1186/S12903-024-05072-1`): segmentation of **dental
  calculus, gingivitis, and caries** on ~3,365 intraoral photos — directly on-target for two of
  our indicators. Check whether the images/labels are released or available on request.
- **Pediatric plaque disclosing-dye set** referenced by AlphaDent: plaque annotations after a
  disclosing dye — `plaque-tartar` relevant, but pediatric.

## Explicitly out of scope (common search hits that don't fit)

- **Radiograph / panoramic X-ray datasets** — e.g. DENTEX (CC BY-NC-SA 4.0), BRAR (CC BY 4.0),
  the multi-center panoramic set (`qinxin99`, non-commercial + cite), Apical Periodontitis
  (CC BY-NC 4.0). Wrong **modality** (X-ray, not a photo) for a phone-camera app.
- **Tongue / oral-cancer sets** (e.g. tooth-marked-tongue; "Oral Cancer (Lips and Tongue)") —
  different target; oral cancer is **Phase 2** (higher-stakes, requires clinical validation).

## Coverage vs. our indicators

| Indicator | Open-data coverage | Notes |
| --- | --- | --- |
| `gingival-inflammation` | **Best** | Gingivitis-Captioning, MIO, OralSDv1 |
| `plaque-tartar` | **Partial** | AIRC-LABDEN (orthodontic), OralSDv1 (license?), pediatric dye set — no clean adult general-population open set yet |
| `tooth-staining` | **Weakest** | Only OralSDv1 (license/provenance unresolved); likely needs the clinical-partner track or targeted collection |

## Recommended first moves (pending legal/licensing review)

1. **Resolve the Gingivitis-Captioning license** (BY vs BY-NC) with the depositor; if truly BY,
   it is a strong first `gingival-inflammation` source.
2. **Request access to MIO** and confirm its license — adult healthy/gingivitis/periodontitis
   is well aligned with our scope.
3. Use **AlphaDent** (Apache-2.0) as real intraoral photos for **capture-quality +
   mouth-presence + unlabeled pretraining** (not indicator labels).
4. For **plaque/staining**, treat the **clinical-partner track** (DUA + IRB) as the primary
   path; keep OralSDv1 only as a lead pending license/provenance.
5. **Before any ingestion:** verify the license on the primary source, confirm consent +
   de-identification, then encode as a `DatasetManifest` and validate with `validateManifest`
   and `validateAnnotationForManifest`.

## Ongoing discovery

- Curated index: `github.com/sergiouribe/dental_datasets_itu` (`AI_Dental_Datasets_List.md`) — a
  maintained list of dental AI datasets; re-scan periodically.

---

*Provisional shortlist compiled from public sources during research; treat all license/consent
details as unverified until checked against the primary source.*
