/**
 * Been - Interactive travel map
 * 
 * Architecture:
 * - Load visits data from JSON
 * - Apply visited state to SVG countries via data-iso attribute
 * - Handle hover tooltips with flag emoji
 * - Handle click to open modal with visit details
 */

const COUNTRY_NAMES = {
  'US': 'United States',
  'FR': 'France',
  'JP': 'Japan',
  'GB': 'United Kingdom',
  'IT': 'Italy',
  'ES': 'Spain',
  'DE': 'Germany',
  'CA': 'Canada',
  'AU': 'Australia',
  'BR': 'Brazil',
  'IN': 'India',
  'CN': 'China',
  'MX': 'Mexico',
  'RU': 'Russia',
  'KR': 'South Korea',
  'NL': 'Netherlands',
  'SE': 'Sweden',
  'NO': 'Norway',
  'DK': 'Denmark',
  'FI': 'Finland',
  'PL': 'Poland',
  'PT': 'Portugal',
  'GR': 'Greece',
  'TR': 'Turkey',
  'EG': 'Egypt',
  'ZA': 'South Africa',
  'AR': 'Argentina',
  'CL': 'Chile',
  'TH': 'Thailand',
  'VN': 'Vietnam',
  'ID': 'Indonesia',
  'PH': 'Philippines',
  'MY': 'Malaysia',
  'SG': 'Singapore',
  'NZ': 'New Zealand',
  'CH': 'Switzerland',
  'AT': 'Austria',
  'BE': 'Belgium',
  'IE': 'Ireland',
  'CZ': 'Czech Republic',
  'HU': 'Hungary',
  'RO': 'Romania',
  'UA': 'Ukraine',
  'IL': 'Israel',
  'SA': 'Saudi Arabia',
  'AE': 'United Arab Emirates',
  'PK': 'Pakistan',
  'BD': 'Bangladesh',
  'NG': 'Nigeria',
  'KE': 'Kenya',
  'MA': 'Morocco',
  'TN': 'Tunisia',
  'CO': 'Colombia',
  'PE': 'Peru',
  'VE': 'Venezuela',
  'IS': 'Iceland',
  'HR': 'Croatia',
  'SI': 'Slovenia',
  'RS': 'Serbia',
  'BG': 'Bulgaria',
  'SK': 'Slovakia',
  'LT': 'Lithuania',
  'LV': 'Latvia',
  'EE': 'Estonia'
};

const rawBaseUrl = (typeof window !== 'undefined' && window.__BEEN_BASE_URL__) || '/';
const BASE_URL = rawBaseUrl.endsWith('/') ? rawBaseUrl : `${rawBaseUrl}/`;
const withBase = (path) => `${BASE_URL}${path.replace(/^\//, '')}`;

class BeenMap {
  constructor() {
    this.visits = {};
    this.tooltip = null;
    this.modal = null;
    this.counter = null;
    this.resetButton = null;
    this.listToggle = null;
    this.listToggleLabel = null;
    this.listWrapper = null;
    this.listContent = null;
    this.listSearch = null;
    this.filterStatus = null;
    this.filterGroup = null;
    this.filterContinent = null;
    this.currentCountry = null;
    this.svg = null;
    this.mapContainer = null;
    this.zoomScale = 1;
    this.minZoom = 1;
    this.maxZoom = 8;
    this.translateX = 0;
    this.translateY = 0;
    this.isPointerDown = false;
    this.isDragging = false;
    this.dragStartX = 0;
    this.dragStartY = 0;
    this.suppressNextClick = false;
    this.clickTimeout = null;
    this.totalCountries = 0;
    this.countries = [];
    this.continentTotals = {};
    this.filterSort = null;
    this.statsBar = null;
    this.independentIsoSet = null;
    this.continentByIso = null;
    this.nonSovereignIsoFallback = new Set([
      'AS', 'AI', 'AW', 'BM', 'BQ', 'BV', 'CC', 'CK', 'CW', 'CX', 'EH', 'FK',
      'FO', 'GF', 'GG', 'GI', 'GL', 'GP', 'GU', 'HK', 'HM', 'IM', 'IO', 'JE',
      'KY', 'MF', 'MO', 'MP', 'MS', 'NC', 'NF', 'NU', 'PF', 'PM', 'PN', 'PR',
      'RE', 'SH', 'SJ', 'TK', 'UM', 'VG', 'VI', 'WF', 'YT',
    ]);
  }

  async init() {
    try {
      // Load visits data (injected by Astro page with fallback to public path)
      if (window.__BEEN_VISITS__ && typeof window.__BEEN_VISITS__ === 'object') {
        this.visits = window.__BEEN_VISITS__;
      } else {
        try {
          const dataVersion = (typeof window !== 'undefined' && window.__BEEN_DATA_VERSION__) || Date.now();
          const response = await fetch(withBase(`/data/visits.json?v=${encodeURIComponent(String(dataVersion))}`));
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          this.visits = await response.json();
        } catch (fetchError) {
          console.warn('Failed to load visits data. Continuing with empty visits.', fetchError);
          this.visits = {};
        }
      }
      
      // Setup DOM elements
      this.tooltip = document.querySelector('.tooltip');
      const dialogs = Array.from(document.querySelectorAll('dialog'));
      this.modal = dialogs.find((dialog) => dialog.querySelector('.modal-title')) || dialogs[0] || null;
      this.counter = document.getElementById('visit-counter');
      this.resetButton = document.getElementById('zoom-reset');
      this.listToggle = document.getElementById('list-toggle');
      this.listToggleLabel = document.getElementById('list-toggle-label');
      this.listWrapper = document.getElementById('list-wrapper');
      this.listContent = document.getElementById('list-content');
      this.listSearch = document.getElementById('list-search');
      this.filterStatus = document.getElementById('filter-status');
      this.filterGroup = document.getElementById('filter-group');
      this.filterContinent = document.getElementById('filter-continent');
      this.filterSort = document.getElementById('filter-sort');
      this.statsBar = document.getElementById('stats-bar');
      
      // Setup map
      this.setupMap();

      // Setup zoom controls
      this.setupResetControl();
      this.setupZoomInteractions();
      this.setupListView();
      
      // Setup modal close handlers
      this.setupModal();
      await this.loadCountryIndex();
      this.updateVisitedCounter();
      this.updateStatsBar();
      this.renderList();
      this.updateListToggleLabel();
      
    } catch (error) {
      console.error('Failed to initialize map:', error);
    }
  }

  setupMap() {
    const svg = document.querySelector('.map-container svg');
    if (!svg) {
      console.error('SVG map not found');
      return;
    }

    this.svg = svg;
    this.mapContainer = document.querySelector('.map-container');
    this.applyMapTransform();

    // Find all country paths; prefer data-iso when present, but support plain path maps too
    const countries = svg.querySelectorAll('[data-iso], path');
    
    countries.forEach(country => {
      const rawIso = country.getAttribute('data-iso') || '';
      const iso = this.normalizeIso(rawIso);
      const countryName = country.getAttribute('data-name') || COUNTRY_NAMES[iso] || rawIso || 'Country';
      country.dataset.isoNormalized = iso;
      country.dataset.countryName = countryName;
      
      // Add country class
      country.classList.add('country');
      
      // Mark as visited if in data
      if ((iso && this.visits[iso]?.visited) || (rawIso && this.visits[rawIso]?.visited)) {
        country.classList.add('visited');
      }
      
      // Add event listeners
      country.addEventListener('mouseenter', (e) => this.handleHover(e, country));
      country.addEventListener('mousemove', (e) => this.handleMouseMove(e));
      country.addEventListener('mouseleave', () => this.handleHoverEnd());
      country.addEventListener('click', (event) => {
        if (this.suppressNextClick) {
          this.suppressNextClick = false;
          return;
        }

        if (event.detail > 1) {
          if (this.clickTimeout) {
            clearTimeout(this.clickTimeout);
            this.clickTimeout = null;
          }
          return;
        }

        this.clickTimeout = window.setTimeout(() => {
          this.handleClick(country);
          this.clickTimeout = null;
        }, 220);
      });
    });

    this.addCountryDots(countries);
  }

  addCountryDots(countries) {
    if (!this.svg) return;

    const dotsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    dotsGroup.setAttribute('class', 'country-dots');

    countries.forEach((country) => {
      if (!country.getBBox) return;

      const bbox = country.getBBox();
      const area = bbox.width * bbox.height;

      if (area > 22 || bbox.width === 0 || bbox.height === 0) {
        return;
      }

      const cx = bbox.x + (bbox.width / 2);
      const cy = bbox.y + (bbox.height / 2);
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', cx);
      circle.setAttribute('cy', cy);
      circle.setAttribute('r', '1.6');
      circle.classList.add('country-dot');

      const rawIso = country.getAttribute('data-iso') || '';
      circle.setAttribute('data-iso', rawIso);
      circle.dataset.isoNormalized = country.dataset.isoNormalized || this.normalizeIso(rawIso);
      circle.dataset.countryName = country.dataset.countryName || rawIso || 'Country';

      if (country.classList.contains('visited')) {
        circle.classList.add('visited');
      }

      circle.addEventListener('mouseenter', (e) => this.handleHover(e, circle));
      circle.addEventListener('mousemove', (e) => this.handleMouseMove(e));
      circle.addEventListener('mouseleave', () => this.handleHoverEnd());
      circle.addEventListener('click', () => {
        if (this.suppressNextClick) {
          this.suppressNextClick = false;
          return;
        }
        this.handleClick(circle);
      });

      dotsGroup.appendChild(circle);
    });

    if (dotsGroup.childNodes.length > 0) {
      this.svg.appendChild(dotsGroup);
    }
  }

  updateVisitedCounter() {
    if (!this.counter) return;

    const visitedCount = Object.values(this.visits).filter(country => country?.visited).length;
    const total = this.totalCountries || 0;
    this.counter.textContent = `${visitedCount}/${total} visited`;
  }

  async loadCountryIndex() {
    try {
      const response = await fetch(withBase('/maps/countries-optimized.geojson'));
      if (!response.ok) return;
      const independentIsoSet = await this.fetchIndependentIsoSet();
      const data = await response.json();
      this.countries = data.features
        .map((feature) => this.mapFeatureToCountry(feature))
        .filter(Boolean)
        .filter((country) => {
          if (independentIsoSet) {
            return independentIsoSet.has(country.iso);
          }
          return !this.nonSovereignIsoFallback.has(country.iso);
        });
      this.totalCountries = this.countries.length;
      this.buildContinentTotals();
      this.populateContinentFilter();
    } catch (error) {
      console.error('Failed to load country index:', error);
    }
  }

  async fetchIndependentIsoSet() {
    if (this.independentIsoSet) {
      return this.independentIsoSet;
    }

    try {
      const response = await fetch('https://restcountries.com/v3.1/all?fields=cca2,independent,region,subregion');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const list = await response.json();
      const continentByIso = new Map();

      list.forEach((country) => {
        if (typeof country?.cca2 !== 'string') return;
        const iso = country.cca2.toUpperCase();
        const continent = this.mapContinentFromMetadata(country.region, country.subregion, iso);
        if (continent) {
          continentByIso.set(iso, continent);
        }
      });

      const set = new Set(
        list
          .filter((country) => country?.independent === true && typeof country?.cca2 === 'string')
          .map((country) => country.cca2.toUpperCase())
      );

      // Include Palestine explicitly for this tracker
      set.add('PS');
      continentByIso.set('PS', 'Asia');

      this.independentIsoSet = set;
      this.continentByIso = continentByIso;
      return set;
    } catch (error) {
      console.warn('Failed to load independent country index. Falling back to full map index.', error);
      this.independentIsoSet = null;
      this.continentByIso = null;
      return null;
    }
  }

  mapContinentFromMetadata(region, subregion, iso) {
    const isoOverrides = {
      // Align to requested grouping
      TR: 'Asia',
      CY: 'Asia',
      GE: 'Asia',
      AZ: 'Asia',
      AM: 'Asia',
      RU: 'Europe',
    };

    if (isoOverrides[iso]) {
      return isoOverrides[iso];
    }

    if (region === 'Africa') return 'Africa';
    if (region === 'Asia') return 'Asia';
    if (region === 'Europe') return 'Europe';
    if (region === 'Oceania') return 'Oceania';
    if (region === 'Antarctic') return 'Antarctica';

    if (region === 'Americas') {
      if (typeof subregion === 'string' && /south/i.test(subregion)) {
        return 'South America';
      }
      return 'North America';
    }

    return '';
  }

  mapFeatureToCountry(feature) {
    const iso = this.resolveIsoCode(feature);
    if (!iso || iso === 'AQ') return null;

    // ── Continent overrides ──────────────────────────────────────────────
    // The geometric guessContinent() algorithm makes systematic errors for
    // countries whose centroids fall near continent boundaries or span the
    // dateline.  These hard-coded values take precedence.
    const continentOverrides = {
      // Middle East: geometric centroid lands in Africa (lon 35–60, lat < 35)
      'AE': 'Asia', 'BH': 'Asia', 'IQ': 'Asia', 'IR': 'Asia',
      'IL': 'Asia', 'JO': 'Asia', 'KW': 'Asia', 'LB': 'Asia',
      'OM': 'Asia', 'PS': 'Asia', 'QA': 'Asia', 'SA': 'Asia',
      'SY': 'Asia', 'YE': 'Asia',
      // Cyprus: centroid lat ≈ 35.0 — ties resolve to Africa in the algo
      'CY': 'Europe',
      // France: GeoJSON may include overseas territories that shift centroid
      'FR': 'Europe',
      // Pacific microstates: centroid lon ≥ 60 & lat ≥ 0 → algo returns Asia
      'FM': 'Oceania', 'MH': 'Oceania', 'PW': 'Oceania',
      // Indonesia & East Timor: centroid lat < 0 & lon ≥ 90 → algo returns Oceania
      'ID': 'Asia', 'TL': 'Asia',
      // British Indian Ocean Territory: centroid lat < 0 → Oceania; actually Indian Ocean/Asia
      'IO': 'Asia',
      // Kiribati: centroid lon ≈ −157 → algo returns North America
      'KI': 'Oceania',
    };

    // ── Name overrides ───────────────────────────────────────────────────
    // Standardise common English names that differ from the GeoJSON ADMIN field.
    const nameOverrides = {
      'CI': 'Côte d\'Ivoire',    // GeoJSON: 'Ivory Coast'
      'SZ': 'Eswatini',          // GeoJSON: 'eSwatini'
      'MO': 'Macau',             // GeoJSON: 'Macao S.A.R'
      'HK': 'Hong Kong',         // GeoJSON: 'Hong Kong S.A.R.'
    };

    const continent = this.continentByIso?.get(iso)
      ?? continentOverrides[iso]
      ?? this.guessContinent(feature.geometry);
    const name = nameOverrides[iso] ?? (feature.properties.ADMIN || iso);

    return { iso, name, continent };
  }

  resolveIsoCode(feature) {
    const rawIso = feature?.properties?.ISO_A2;
    if (rawIso && rawIso !== '-99') {
      return rawIso;
    }

    const admin = feature?.properties?.ADMIN;
    const fallback = {
      France: 'FR',
      Norway: 'NO',
      Kosovo: 'XK'
    };
    return fallback[admin] || null;
  }

  guessContinent(geometry) {
    const { lon, lat } = this.getCentroid(geometry);

    if (lon >= -170 && lon < -30 && lat >= 15) return 'North America';
    if (lon >= -90 && lon < -30 && lat < 15) return 'South America';
    if (lon >= -30 && lon < 60 && lat >= 35) return 'Europe';
    if (lon >= -30 && lon < 60 && lat < 35) return 'Africa';
    if (lon >= 60 && lon <= 180 && lat >= 0) return 'Asia';
    if (lon >= 90 && lon <= 180 && lat < 0) return 'Oceania';

    if (lat < 0) return 'Oceania';
    if (lon < -30) return 'North America';
    return 'Europe';
  }

  getCentroid(geometry) {
    let sumLon = 0;
    let sumLat = 0;
    let count = 0;

    const addPoint = (point) => {
      if (!point || point.length < 2) return;
      sumLon += point[0];
      sumLat += point[1];
      count += 1;
    };

    const walk = (coords) => {
      if (!coords) return;
      if (typeof coords[0] === 'number') {
        addPoint(coords);
        return;
      }
      coords.forEach(walk);
    };

    walk(geometry.coordinates);

    if (!count) return { lon: 0, lat: 0 };
    return { lon: sumLon / count, lat: sumLat / count };
  }

  setupListView() {
    if (!this.listToggle || !this.listWrapper) return;

    this.listToggle.addEventListener('click', () => {
      const nextIsListView = !document.body.classList.contains('list-view');
      document.body.classList.toggle('list-view', nextIsListView);
      this.listWrapper.hidden = !nextIsListView;
      this.updateListToggleLabel();
    });

    const rerender = () => this.renderList();
    this.listSearch?.addEventListener('input', rerender);
    this.filterStatus?.addEventListener('change', rerender);
    this.filterGroup?.addEventListener('change', rerender);
    this.filterContinent?.addEventListener('change', rerender);
    this.filterSort?.addEventListener('change', rerender);

    // Delegate list-item clicks → open country modal (stay in list mode)
    this.listContent?.addEventListener('click', (e) => {
      const item = e.target.closest('.list-item[data-iso]');
      if (!item) return;
      const iso = item.dataset.iso;
      if (iso) this.openCountryModalByIso(iso);
    });
  }

  updateListToggleLabel() {
    if (!this.listToggleLabel || !this.listToggle) return;
    const isListView = document.body.classList.contains('list-view');
    this.listToggleLabel.textContent = isListView ? 'Map' : 'List';
    this.listToggle.setAttribute('aria-label', isListView ? 'Open map view' : 'Open list view');

    const iconPath = this.listToggle.querySelector('path');
    if (iconPath) {
      // List icon for map mode toggle; map icon for list mode toggle
      iconPath.setAttribute(
        'd',
        isListView
          ? 'M3 6.5 9 4l6 2.5L21 4v13.5L15 20l-6-2.5L3 20V6.5m6-2.5v13.5m6-11V20'
          : 'M4 6.5h16M4 12h16M4 17.5h16'
      );
    }
  }

  buildContinentTotals() {
    const totals = {};

    this.countries.forEach((country) => {
      if (!totals[country.continent]) {
        totals[country.continent] = { total: 0, visited: 0 };
      }
      totals[country.continent].total += 1;
      if (this.visits[country.iso]?.visited) {
        totals[country.continent].visited += 1;
      }
    });

    if (!totals.Antarctica) {
      totals.Antarctica = { total: 0, visited: 0 };
    }

    this.continentTotals = totals;
  }

  populateContinentFilter() {
    if (!this.filterContinent || this.countries.length === 0) return;
    const continents = Array.from(new Set(this.countries.map((c) => c.continent)));
    if (!continents.includes('Antarctica')) {
      continents.push('Antarctica');
    }
    continents.sort();
    const options = ['all', ...continents];

    this.filterContinent.innerHTML = options
      .map((continent) => {
        const label = continent === 'all' ? 'All continents' : continent;
        return `<option value="${continent}">${label}</option>`;
      })
      .join('');
  }

  renderList() {
    if (!this.listContent) return;

    const search = (this.listSearch?.value || '').trim().toLowerCase();
    const statusFilter = this.filterStatus?.value || 'all';
    const groupBy = this.filterGroup?.value || 'continent';
    const continentFilter = this.filterContinent?.value || 'all';
    const sortOrder = this.filterSort?.value || 'alpha';

    const filtered = this.countries.filter((country) => {
      const isVisited = Boolean(this.visits[country.iso]?.visited);
      if (statusFilter === 'visited' && !isVisited) return false;
      if (statusFilter === 'not-visited' && isVisited) return false;
      if (continentFilter !== 'all' && country.continent !== continentFilter) return false;
      if (search && !country.name.toLowerCase().includes(search)) return false;
      return true;
    });

    const groups = this.groupCountries(filtered, groupBy, sortOrder);
    this.listContent.innerHTML = groups.map((group) => this.renderGroup(group, groupBy)).join('');
  }

  groupCountries(countries, groupBy, sortOrder = 'alpha') {
    if (groupBy === 'none') {
      return [{ title: 'All countries', countries: this.sortCountries(countries, sortOrder) }];
    }

    const map = new Map();
    countries.forEach((country) => {
      const key = groupBy === 'status'
        ? (this.visits[country.iso]?.visited ? 'Visited' : 'Yet to visit')
        : country.continent;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(country);
    });

    return Array.from(map.entries())
      .map(([title, list]) => ({ title, countries: this.sortCountries(list, sortOrder) }))
      .sort((a, b) => a.title.localeCompare(b.title));
  }

  sortCountries(list, sortOrder) {
    const copy = [...list];
    if (sortOrder === 'visited-first') {
      return copy.sort((a, b) => {
        const av = this.visits[a.iso]?.visited ? 0 : 1;
        const bv = this.visits[b.iso]?.visited ? 0 : 1;
        return av - bv || a.name.localeCompare(b.name);
      });
    }
    if (sortOrder === 'unvisited-first') {
      return copy.sort((a, b) => {
        const av = this.visits[a.iso]?.visited ? 1 : 0;
        const bv = this.visits[b.iso]?.visited ? 1 : 0;
        return av - bv || a.name.localeCompare(b.name);
      });
    }
    // default: alphabetical
    return copy.sort((a, b) => a.name.localeCompare(b.name));
  }

  renderGroup(group, groupBy) {
    const items = group.countries.map((country) => {
      const isVisited = Boolean(this.visits[country.iso]?.visited);
      const flag = this.getFlag(country.iso);
      const year = isVisited ? this.getLatestYear(country.iso) : null;
      const yearBadge = year ? `<span class="visit-year-badge">${year}</span>` : '';
      return `
        <div class="list-item ${isVisited ? 'visited' : ''}" data-iso="${country.iso}" title="Click to locate on map">
          <span class="status-dot"></span>
          <span class="flag-emoji" aria-hidden="true">${flag}</span>
          <span class="country-name">${country.name}</span>
          ${yearBadge}
        </div>
      `;
    }).join('');

    const heading = this.formatGroupHeading(group, groupBy);

    return `
      <section class="list-group">
        ${heading}
        <div class="list-grid">
          ${items}
        </div>
      </section>
    `;
  }

  formatGroupHeading(group, groupBy) {
    const stats = this.continentTotals[group.title];

    // Progress bar — only for continent grouping where we have global totals
    if (stats && groupBy === 'continent') {
      const pct = stats.total > 0 ? Math.round((stats.visited / stats.total) * 100) : 0;
      return `
        <div class="group-heading-wrap">
          <div class="group-heading-top">
            <span class="group-title">${group.title}</span>
            <span class="group-count">${stats.visited} / ${stats.total} &middot; ${pct}%</span>
          </div>
          <div class="progress-track" aria-hidden="true">
            <div class="progress-fill" style="width:${pct}%"></div>
          </div>
        </div>
      `;
    }

    // Status or no-grouping: plain count
    const count = stats
      ? `${stats.visited}/${stats.total}`
      : group.countries.length;
    return `<h3>${group.title} (${count})</h3>`;
  }

  // ── Stats bar ────────────────────────────────────────────────────────────

  updateStatsBar() {
    if (!this.statsBar) return;

    const visitedCount = Object.values(this.visits).filter((v) => v?.visited).length;
    const total = this.totalCountries || 197;
    const pct = total > 0 ? Math.round((visitedCount / total) * 100) : 0;

    const continentsExplored = Object.entries(this.continentTotals)
      .filter(([, s]) => s.visited > 0).length;
    const continentsTotal = Object.keys(this.continentTotals).length || 6;

    this.statsBar.innerHTML = `
      <div class="stat-chip">
        <span class="stat-chip-value">${visitedCount}</span>
        <span class="stat-chip-label">countries</span>
      </div>
      <div class="stat-chip-divider"></div>
      <div class="stat-chip">
        <span class="stat-chip-value">${continentsExplored}<span class="stat-chip-denom">/${continentsTotal}</span></span>
        <span class="stat-chip-label">continents</span>
      </div>
      <div class="stat-chip-divider"></div>
      <div class="stat-chip">
        <span class="stat-chip-value">${pct}%</span>
        <span class="stat-chip-label">of the world</span>
      </div>
    `;
  }

  // ── Year helper ───────────────────────────────────────────────────────────

  getLatestYear(iso) {
    const visits = this.visits[iso]?.visits;
    if (!Array.isArray(visits) || visits.length === 0) return null;

    let best = 0;
    for (const v of visits) {
      const val = this.getVisitSortValue(v.time);
      if (val > best) best = val;
    }
    if (!best) return null;
    return new Date(best).getUTCFullYear();
  }

  // ── Map ↔ List interaction ────────────────────────────────────────────────

  switchToMapView() {
    document.body.classList.remove('list-view');
    if (this.listWrapper) this.listWrapper.hidden = true;
    this.updateListToggleLabel();
  }

  openCountryModalByIso(iso) {
    if (!iso) return;

    const svgMatch = this.svg?.querySelector(`[data-iso="${iso}"]`)
      || this.svg?.querySelector(`[data-iso="${iso.toLowerCase()}"]`);

    if (svgMatch) {
      this.handleClick(svgMatch);
      return;
    }

    const country = this.countries.find((item) => item.iso === iso);
    if (!country) return;

    const pseudoElement = {
      getAttribute: (name) => {
        if (name === 'data-iso') return country.iso;
        if (name === 'data-name') return country.name;
        return '';
      },
      dataset: {
        isoNormalized: country.iso,
        countryName: country.name,
      },
    };

    this.handleClick(pseudoElement);
  }

  zoomToCountry(iso) {
    if (!this.svg || !iso) return;

    // Find SVG element(s) with this ISO code
    const el = this.svg.querySelector(`[data-iso="${iso}"]`)
      || this.svg.querySelector(`[data-iso="${iso.toLowerCase()}"]`);

    if (!el) {
      // Country not in SVG (e.g. tiny territory rendered as dot) — just switch view
      this.switchToMapView();
      return;
    }

    this.switchToMapView();

    // Give the layout a frame to finish before reading getBBox
    requestAnimationFrame(() => {
      try {
        const bbox = el.getBBox();
        if (!bbox || bbox.width === 0) return;

        const containerRect = this.mapContainer.getBoundingClientRect();
        const cw = containerRect.width;
        const ch = containerRect.height;

        // Target: fill ~40% of the viewport dimension with the bounding box
        const targetScale = Math.min(
          (cw * 0.4) / bbox.width,
          (ch * 0.4) / bbox.height,
          this.maxZoom,
        );
        const scale = Math.max(this.minZoom, targetScale);

        // Centre the bbox in the container
        const bboxCx = bbox.x + bbox.width / 2;
        const bboxCy = bbox.y + bbox.height / 2;

        // The SVG's coordinate system is scaled by the SVG element's intrinsic size
        // We need to account for the current SVG display width vs viewBox width
        const svgEl = this.svg;
        const vb = svgEl.viewBox?.baseVal;
        const svgDisplayW = svgEl.getBoundingClientRect().width;
        const coordScale = vb && vb.width > 0 ? svgDisplayW / vb.width : 1;

        this.zoomScale = scale;
        this.translateX = cw / 2 - bboxCx * coordScale * scale;
        this.translateY = ch / 2 - bboxCy * coordScale * scale;
        this.applyMapTransform();

        // Pulse-highlight the element
        el.classList.add('highlight-pulse');
        setTimeout(() => el.classList.remove('highlight-pulse'), 1400);
      } catch (_) {
        // getBBox can throw in some environments; silently ignore
      }
    });
  }

  // ── Tooltip positioning ───────────────────────────────────────────────────

  positionTooltip(event) {
    if (!this.tooltip) return;

    const offset = 8;
    const tooltipWidth = this.tooltip.offsetWidth || 0;
    const tooltipHeight = this.tooltip.offsetHeight || 0;
    let left = event.clientX + offset;
    let top = event.clientY + offset;

    const maxLeft = window.innerWidth - tooltipWidth - 8;
    const maxTop = window.innerHeight - tooltipHeight - 8;

    if (left > maxLeft) {
      left = event.clientX - tooltipWidth - offset;
    }

    if (top > maxTop) {
      top = event.clientY - tooltipHeight - offset;
    }

    left = Math.max(8, left);
    top = Math.max(8, top);

    this.tooltip.style.left = `${left}px`;
    this.tooltip.style.top = `${top}px`;
  }

  handleHover(event, countryElement) {
    const rawIso = countryElement.getAttribute('data-iso') || '';
    const iso = countryElement.dataset.isoNormalized || this.normalizeIso(rawIso);
    const countryName = countryElement.dataset.countryName || COUNTRY_NAMES[iso] || rawIso || 'Country';
    const countryData = this.visits[iso] || this.visits[rawIso] || { visited: false };
    const flag = iso ? this.getFlag(iso) : '🌍';
    
    // Update tooltip content
    const tooltipCountry = this.tooltip.querySelector('.tooltip-country');
    const tooltipStatus = this.tooltip.querySelector('.tooltip-status');
    
    tooltipCountry.innerHTML = `
      <span class="tooltip-flag">${flag}</span>
      <span>${countryName}</span>
    `;
    
    tooltipStatus.textContent = countryData.visited ? '✓ Visited' : 'Yet to visit';
    tooltipStatus.className = `tooltip-status ${countryData.visited ? 'visited' : ''}`;
    
    // Position and show tooltip
    this.tooltip.classList.add('visible');
    this.positionTooltip(event);
  }

  handleMouseMove(event) {
    if (this.tooltip.classList.contains('visible')) {
      this.positionTooltip(event);
    }
  }

  handleHoverEnd() {
    this.tooltip.classList.remove('visible');
  }

  handleClick(countryElement) {
    const rawIso = countryElement.getAttribute('data-iso') || '';
    const iso = countryElement.dataset.isoNormalized || this.normalizeIso(rawIso);
    this.currentCountry = iso || rawIso;
    const countryName = countryElement.dataset.countryName || COUNTRY_NAMES[iso] || rawIso || 'Country';
    const countryData = this.visits[iso] || this.visits[rawIso] || { visited: false };
    const flag = iso ? this.getFlag(iso) : '🌍';
    
    if (!this.modal) {
      console.warn('Modal container not found; skipping country detail modal.');
      return;
    }

    // Update modal content
    const modalTitleWrap = this.modal.querySelector('.modal-title');
    let modalTitle = this.modal.querySelector('.modal-title h2') || this.modal.querySelector('h2');
    let modalFlag = this.modal.querySelector('.modal-flag');

    if (!modalTitle && modalTitleWrap) {
      modalTitle = document.createElement('h2');
      modalTitleWrap.appendChild(modalTitle);
    }

    if (!modalFlag && modalTitleWrap) {
      modalFlag = document.createElement('span');
      modalFlag.className = 'modal-flag';
      modalTitleWrap.prepend(modalFlag);
    }

    if (modalTitle) {
      modalTitle.textContent = countryName;
    }

    if (modalFlag) {
      modalFlag.textContent = flag;
    }

    let territoryNote = this.modal.querySelector('.modal-territory-note');
    const territoryParent = this.getTerritoryParent(iso || rawIso);
    if (territoryParent) {
      if (!territoryNote && modalTitleWrap) {
        territoryNote = document.createElement('div');
        territoryNote.className = 'modal-territory-note';
        modalTitleWrap.appendChild(territoryNote);
      }
      if (territoryNote) {
        territoryNote.textContent = `Territory of ${territoryParent}`;
      }
    } else if (territoryNote) {
      territoryNote.remove();
    }

    // Update visits list
    let visitsList = this.modal.querySelector('.visits-list');
    if (!visitsList) {
      const modalBody = this.modal.querySelector('.modal-body') || this.modal;
      visitsList = document.createElement('div');
      visitsList.className = 'visits-list';
      modalBody.appendChild(visitsList);
    }
    const visits = Array.isArray(countryData.visits)
      ? [...countryData.visits].sort((a, b) => this.getVisitSortValue(b.time) - this.getVisitSortValue(a.time))
      : [];

    if (countryData.visited && visits.length > 0) {
      const latestVisit = visits[0];

      // ── Stats bar ──────────────────────────────────────────────────────────
      const latestLabel = this.escapeHtml(latestVisit.time || '—');
      const tripWord = visits.length === 1 ? 'trip' : 'trips';
      const statsHTML = `
        <div class="modal-stats">
          <div class="modal-stat">
            <span class="modal-stat-value">${visits.length}</span>
            <span class="modal-stat-label">${tripWord}</span>
          </div>
          <div class="modal-stat-divider"></div>
          <div class="modal-stat">
            <span class="modal-stat-label">Latest visit</span>
            <span class="modal-stat-value modal-stat-latest">${latestLabel}</span>
          </div>
        </div>
      `;

      // ── Highlights (all trips merged, deduped) ─────────────────────────────
      const highlights = visits.flatMap((visit) =>
        Array.isArray(visit.highlights)
          ? visit.highlights.filter((h) => typeof h === 'string' && h.trim()).map((h) => h.trim())
          : []
      ).filter((h, i, arr) => arr.indexOf(h) === i);

      const highlightsHTML = highlights.length > 0 ? `
        <div class="modal-section modal-highlights">
          <h3 class="modal-section-title">
            <span class="modal-section-icon">✦</span> Highlights
          </h3>
          <ul class="modal-highlights-list">
            ${highlights.map((h) => `<li>${this.escapeHtml(h)}</li>`).join('')}
          </ul>
        </div>
      ` : '';

      // ── Visits timeline (already sorted latest-first) ─────────────────────
      const timelineHTML = visits.map((visit, idx) => {
        const time = this.escapeHtml(visit.time || 'Unknown');
        const reason = this.escapeHtml(visit.reason || '');
        const isLatest = idx === 0;
        return `
          <div class="modal-trip${isLatest ? ' modal-trip--latest' : ''}">
            <div class="modal-trip-header">
              <span class="modal-trip-time">${time}</span>
              ${reason ? `<span class="modal-trip-reason">${reason}</span>` : ''}
              ${isLatest ? '<span class="modal-trip-badge">Latest</span>' : ''}
            </div>
          </div>
        `;
      }).join('');

      const visitsSection = `
        <div class="modal-section">
          <h3 class="modal-section-title">
            <span class="modal-section-icon">🗓</span> Visits
          </h3>
          <div class="modal-trips">
            ${timelineHTML}
          </div>
        </div>
      `;

      // ── Notes ──────────────────────────────────────────────────────────────
      const noteEntries = visits.filter(
        (v) => typeof v.notes === 'string' && v.notes.trim()
      );

      const notesHTML = noteEntries.length > 0 ? `
        <div class="modal-section modal-notes-section">
          <h3 class="modal-section-title">
            <span class="modal-section-icon">📝</span> Notes
          </h3>
          <div class="modal-notes">
            ${noteEntries.map((v) => `
              <div class="modal-note">
                <span class="modal-note-time">${this.escapeHtml(v.time || '—')}</span>
                <p class="modal-note-text">${this.escapeHtml(v.notes.trim())}</p>
              </div>
            `).join('')}
          </div>
        </div>
      ` : '';

      const showOnMapHTML = `
        ${document.body.classList.contains('list-view') ? `
          <div class="modal-section modal-map-actions">
            <button type="button" class="modal-show-map" data-iso="${this.escapeHtml(iso || rawIso)}">
              Show on map
            </button>
          </div>
        ` : ''}
      `;

      visitsList.style.display = 'flex';
      visitsList.innerHTML = statsHTML + highlightsHTML + visitsSection + notesHTML + showOnMapHTML;

    } else {
      visitsList.style.display = 'block';
      visitsList.innerHTML = `
        <div class="modal-no-visits">
          <span class="modal-no-visits-icon">📍</span>
          <p>Yet to visit</p>
        </div>
        ${document.body.classList.contains('list-view') ? `
          <div class="modal-section modal-map-actions">
            <button type="button" class="modal-show-map" data-iso="${this.escapeHtml(iso || rawIso)}">
              Show on map
            </button>
          </div>
        ` : ''}
      `;
    }
    
    // Show modal
    this.openModal();
  }

  setupModal() {
    if (!this.modal) return;

    const closeBtn = this.modal.querySelector('.modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeModal());
    }
    
    // Close on backdrop click
    this.modal.addEventListener('click', (e) => {
      const mapButton = e.target.closest('.modal-show-map');
      if (mapButton) {
        const iso = mapButton.getAttribute('data-iso') || '';
        this.closeModal();
        this.zoomToCountry(iso);
        return;
      }

      if (e.target === this.modal) {
        this.closeModal();
      }
    });

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.modal?.hasAttribute('open')) {
        this.closeModal();
      }
    });
  }

  openModal() {
    if (!this.modal) return;

    if (typeof this.modal.showModal === 'function') {
      try {
        if (!this.modal.open) {
          this.modal.showModal();
        }
        return;
      } catch (error) {
        console.warn('showModal failed, using open attribute fallback.', error);
      }
    }

    this.modal.setAttribute('open', '');
    this.modal.classList.add('dialog-open-fallback');
  }

  closeModal() {
    if (!this.modal) return;

    if (typeof this.modal.close === 'function') {
      try {
        this.modal.close();
      } catch (error) {
        this.modal.removeAttribute('open');
      }
    } else {
      this.modal.removeAttribute('open');
    }

    this.modal.classList.remove('dialog-open-fallback');
  }

  getTerritoryParent(iso) {
    const territoryParent = {
      'HK': 'China',
      'MO': 'China',
      'IO': 'United Kingdom',
      'SH': 'United Kingdom',
      'GI': 'United Kingdom',
      'GG': 'United Kingdom',
      'JE': 'United Kingdom',
      'IM': 'United Kingdom',
      'RE': 'France',
      'GF': 'France',
      'GP': 'France',
      'PF': 'France',
      'NC': 'France',
      'AW': 'Netherlands',
      'CW': 'Netherlands',
      'BQ': 'Netherlands',
      'PR': 'United States',
      'VI': 'United States',
      'GU': 'United States',
      'AS': 'United States',
      'MP': 'United States',
    };

    return territoryParent[iso] || '';
  }

  getFlag(iso) {
    if (!iso || iso.length !== 2) {
      return '🌍';
    }

    // Convert ISO country code to flag emoji
    // Using regional indicator symbols
    const codePoints = [...iso.toUpperCase()].map(char => 
      127397 + char.charCodeAt(0)
    );
    return String.fromCodePoint(...codePoints);
  }

  normalizeIso(rawIso) {
    if (!rawIso) return '';
    if (rawIso.length === 2) return rawIso.toUpperCase();
    if (rawIso.includes('-')) {
      const parts = rawIso.split('-');
      const tail = parts[parts.length - 1];
      if (tail && tail.length === 2) {
        return tail.toUpperCase();
      }
    }
    return '';
  }

  getVisitSortValue(time) {
    if (!time || typeof time !== 'string') return 0;

    const trimmedTime = time.trim();
    if (/^\d{4}$/.test(trimmedTime)) {
      return Date.UTC(Number(trimmedTime), 0, 1);
    }

    if (/^\d{4}-\d{2}$/.test(trimmedTime)) {
      const [year, month] = trimmedTime.split('-').map(Number);
      return Date.UTC(year, Math.max(0, Math.min(11, month - 1)), 1);
    }

    const parsed = Date.parse(trimmedTime);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  setupResetControl() {
    if (!this.resetButton) return;
    this.resetButton.addEventListener('click', () => this.resetZoom());
  }

  updateResetButtonVisibility() {
    if (!this.resetButton) return;
    this.resetButton.hidden = this.zoomScale <= 1;
  }

  setupZoomInteractions() {
    if (!this.svg || !this.mapContainer) return;

    let pinchDistance = null;

    this.mapContainer.addEventListener('wheel', (event) => {
      event.preventDefault();

      const zoomFactor = event.deltaY < 0 ? 1.1 : 0.9;
      this.zoomBy(zoomFactor, event.clientX, event.clientY);
    }, { passive: false });

    this.mapContainer.addEventListener('dblclick', (event) => {
      event.preventDefault();
      if (this.clickTimeout) {
        clearTimeout(this.clickTimeout);
        this.clickTimeout = null;
      }
      this.zoomBy(1.6, event.clientX, event.clientY);
    });

    this.svg.addEventListener('mousedown', (event) => {
      this.isPointerDown = true;
      this.isDragging = false;
      this.dragStartX = event.clientX;
      this.dragStartY = event.clientY;
      this.svg.style.cursor = 'grabbing';
    });

    this.mapContainer.addEventListener('touchstart', (event) => {
      if (event.touches.length === 1) {
        const touch = event.touches[0];
        this.isPointerDown = true;
        this.isDragging = false;
        this.dragStartX = touch.clientX;
        this.dragStartY = touch.clientY;
        pinchDistance = null;
      } else if (event.touches.length === 2) {
        const [t0, t1] = event.touches;
        pinchDistance = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY);
        this.isPointerDown = false;
        this.isDragging = false;
      }
    }, { passive: false });

    this.mapContainer.addEventListener('touchmove', (event) => {
      if (event.touches.length === 2) {
        event.preventDefault();
        const [t0, t1] = event.touches;
        const distance = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY);
        const centerX = (t0.clientX + t1.clientX) / 2;
        const centerY = (t0.clientY + t1.clientY) / 2;

        if (pinchDistance) {
          const factor = distance / pinchDistance;
          this.zoomBy(factor, centerX, centerY);
        }

        pinchDistance = distance;
        return;
      }

      if (event.touches.length !== 1 || !this.isPointerDown) return;

      event.preventDefault();
      const touch = event.touches[0];
      const deltaX = touch.clientX - this.dragStartX;
      const deltaY = touch.clientY - this.dragStartY;

      if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
        this.isDragging = true;
      }

      this.translateX += deltaX;
      if (this.zoomScale > 1) {
        this.translateY += deltaY;
      }

      this.dragStartX = touch.clientX;
      this.dragStartY = touch.clientY;
      this.applyMapTransform();
    }, { passive: false });

    const handleTouchEnd = () => {
      if (this.isDragging) {
        this.suppressNextClick = true;
      }

      this.isPointerDown = false;
      this.isDragging = false;
      pinchDistance = null;
      this.svg.style.cursor = 'grab';
    };

    this.mapContainer.addEventListener('touchend', handleTouchEnd, { passive: true });
    this.mapContainer.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    window.addEventListener('mousemove', (event) => {
      if (!this.isPointerDown) return;

      const deltaX = event.clientX - this.dragStartX;
      const deltaY = event.clientY - this.dragStartY;

      if (Math.abs(deltaX) > 6 || Math.abs(deltaY) > 6) {
        this.isDragging = true;
      }

      this.translateX += deltaX;
      if (this.zoomScale > 1) {
        this.translateY += deltaY;
      }
      this.dragStartX = event.clientX;
      this.dragStartY = event.clientY;
      this.applyMapTransform();
    });

    window.addEventListener('mouseup', () => {
      if (!this.isPointerDown) return;

      if (this.isDragging) {
        this.suppressNextClick = true;
      }

      this.isPointerDown = false;
      this.isDragging = false;
      this.svg.style.cursor = 'grab';
    });

    window.addEventListener('resize', () => {
      this.applyMapTransform();
    });
  }

  zoomBy(factor, clientX = null, clientY = null) {
    if (!this.svg || !this.mapContainer) return;

    const previousZoom = this.zoomScale;
    const nextZoom = Math.max(this.minZoom, Math.min(this.maxZoom, previousZoom * factor));

    if (nextZoom === previousZoom) return;

    if (clientX !== null && clientY !== null) {
      const rect = this.mapContainer.getBoundingClientRect();
      const pointX = clientX - rect.left;
      const pointY = clientY - rect.top;
      const scaleRatio = nextZoom / previousZoom;

      this.translateX = pointX - (pointX - this.translateX) * scaleRatio;
      this.translateY = pointY - (pointY - this.translateY) * scaleRatio;
    }

    this.zoomScale = nextZoom;

    if (this.zoomScale <= 1) {
      this.translateX = 0;
      this.translateY = 0;
    }

    this.applyMapTransform();
  }

  resetZoom() {
    this.zoomScale = 1;
    this.translateX = 0;
    this.translateY = 0;
    this.applyMapTransform();
  }

  applyMapTransform() {
    if (!this.svg) return;

    // Apply transform first so getBoundingClientRect in clampTranslation
    // reflects the actual post-zoom SVG dimensions (fixes double-click zoom position).
    this.svg.style.transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.zoomScale})`;
    this.svg.style.cursor = this.isPointerDown ? 'grabbing' : '';

    this.clampTranslation();

    // Re-apply after clamping in case values changed.
    this.svg.style.transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.zoomScale})`;
    this.updateResetButtonVisibility();
  }

  clampTranslation() {
    if (!this.mapContainer || !this.svg) return;

    const containerRect = this.mapContainer.getBoundingClientRect();
    // getBoundingClientRect now reflects the already-applied transform.
    const svgRect = this.svg.getBoundingClientRect();
    const scaledWidth = svgRect.width;
    const scaledHeight = svgRect.height;

    const minX = Math.min(0, containerRect.width - scaledWidth);
    const maxX = 0;
    this.translateX = Math.max(minX, Math.min(maxX, this.translateX));

    if (this.zoomScale > 1) {
      const minY = Math.min(0, containerRect.height - scaledHeight);
      const maxY = 0;
      this.translateY = Math.max(minY, Math.min(maxY, this.translateY));
    } else {
      this.translateY = 0;
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const map = new BeenMap();
    map.init();
  });
} else {
  const map = new BeenMap();
  map.init();
}
