"use client";

import React, { useState, useEffect, useRef } from 'react';
import { submitDemoRequest } from './actions';
// External Fonts (Usually put this in layout.tsx, but included here for completeness)
import Head from 'next/head';

const SERVICES_DATA = [
  {
    cat: 'Vehicle Detection & Classification', icon: '🎯',
    items: [
      { id: 'vd1', name: 'Real-Time Vehicle Detection', tag: 'DETECTION', desc: 'Sub-20ms inference on every camera frame using our YOLOv9-based engine. Detect and track vehicles across multiple lanes simultaneously with 99.4% accuracy — including occluded and partially visible vehicles.', metrics: [{ v: '99.4%', l: 'ACCURACY' }, { v: '<20ms', l: 'LATENCY' }, { v: '50+', l: 'CLASSES' }] },
      { id: 'vd2', name: 'Vehicle Classification', tag: 'CLASSIFICATION', desc: 'Classify detected vehicles into 50+ categories: cars, buses, trucks, motorcycles, bicycles, emergency vehicles, and more. Each detection includes confidence scores, bounding boxes, and direction vectors.', metrics: [{ v: '50+', l: 'CLASSES' }, { v: '0.97', l: 'CONF. SCORE' }, { v: '360°', l: 'TRACKING' }] },
      { id: 'vd3', name: 'Urban Mobility Intelligence', tag: 'MOBILITY AI', desc: 'Aggregate detection data into city-level mobility patterns. Understand how people and vehicles move through your city over time — enabling smarter infrastructure investment and policy decisions.', metrics: [{ v: 'City-Wide', l: 'COVERAGE' }, { v: '30-Day', l: 'HISTORY' }, { v: 'API', l: 'ACCESS' }] },
    ]
  },
  {
    cat: 'Counting & Flow Analysis', icon: '🔢',
    items: [
      { id: 'cf1', name: 'Linear Counting', tag: 'COUNTING', desc: 'Count vehicles crossing any defined virtual line drawn on a camera feed. Configure multiple counting lines per camera, with per-lane and per-direction breakdowns. Data exported in real time to your dashboard or API.', metrics: [{ v: 'Multi-lane', l: 'SUPPORT' }, { v: 'Real-Time', l: 'EXPORT' }, { v: '99.1%', l: 'COUNT ACC.' }] },
      { id: 'cf2', name: 'Directional Counting', tag: 'DIRECTIONAL', desc: 'Track vehicle movement across intersections and complex junctions. Define origin-destination zones and measure turn volumes, U-turn rates, and through-traffic with full directional breakdown per vehicle class.', metrics: [{ v: '8-Dir', l: 'VECTORS' }, { v: 'Per-Class', l: 'BREAKDOWN' }, { v: 'Live', l: 'HEATMAP' }] },
    ]
  },
  {
    cat: 'Speed & Density Metrics', icon: '⚡',
    items: [
      { id: 'sd1', name: 'Space Mean Speed', tag: 'SPEED ANALYSIS', desc: 'Measure the true average speed of vehicles over a road segment at a given moment — the most accurate method for congestion and safety analysis. Computed from multi-camera tracking across defined spatial segments.', metrics: [{ v: '±2kph', l: 'ACCURACY' }, { v: 'Segment', l: 'BASED' }, { v: 'Real-Time', l: 'UPDATES' }] },
      { id: 'sd2', name: 'Average Speed', tag: 'SPEED', desc: 'Calculate time-mean speed per lane, per vehicle class, and per time window. Historical trend charts allow comparison of peak vs. off-peak speeds and month-over-month benchmarking for traffic engineers.', metrics: [{ v: 'Per-Lane', l: 'GRANULARITY' }, { v: 'Hourly', l: 'HISTORY' }, { v: 'Class-Split', l: 'VIEW' }] },
      { id: 'sd3', name: 'Segment Density', tag: 'DENSITY', desc: 'Compute real-time vehicle density (vehicles per km) for any defined road segment. Triggers automatic alerts when density exceeds configurable thresholds — feeding directly into adaptive signal control systems.', metrics: [{ v: 'veh/km', l: 'METRIC' }, { v: 'Alert', l: 'TRIGGERS' }, { v: 'Live', l: 'FEED' }] },
    ]
  },
  {
    cat: 'Analytics & Reporting', icon: '📊',
    items: [
      { id: 'ar1', name: 'Traffic Flow Analytics', tag: 'ANALYTICS', desc: 'Unified analytics platform aggregating all detection, counting, and speed data. Visualize traffic patterns across your entire city camera network with drill-down capability from city level to individual camera.', metrics: [{ v: 'All Cams', l: 'UNIFIED' }, { v: '30-Day', l: 'RETENTION' }, { v: 'CSV/API', l: 'EXPORT' }] },
    ]
  }
];

const ALL_ITEMS = SERVICES_DATA.flatMap(c => c.items);

export default function TrafficGANLanding() {
  // --- STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Services Menu State
  const [activeCat, setActiveCat] = useState(-1);
  const [activeItem, setActiveItem] = useState<{ id: string; name: string; tag: string; desc: string; metrics: { v: string; l: string }[] } | null>(null);

  // Form Picker State
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  // Form Input State (Prepped for Prisma)
  const [formData, setFormData] = useState({ name: '', email: '', organization: '', city: '', inquiryType: 'Demo / Services', message: '' });


  // --- EFFECTS ---
  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Vanilla JS Canvas Animation Port
  useEffect(() => {
    const vehicles = [
      { id: 0, x: -100, y: 62, w: 48, h: 20, speed: 1.1, emoji: '🚗' },
      { id: 1, x: 200, y: 70, w: 66, h: 24, speed: 0.7, emoji: '🚌' },
      { id: 2, x: 380, y: 58, w: 44, h: 19, speed: 1.4, emoji: '🚗' },
      { id: 3, x: 600, y: 78, w: 40, h: 21, speed: 0.5, emoji: '🚛' },
    ];
    let vCount = 24;
    let animationFrameId: number;

    const animVehicles = () => {
      vehicles.forEach(v => {
        v.x += v.speed * 1.4;
        if (v.x > 620) {
          v.x = -120;
          vCount = Math.floor(20 + Math.random() * 10);
        }
        ['car', 'bbox', 'lbl'].forEach(p => {
          const el = document.getElementById(p + v.id);
          if (el) el.style.left = v.x + (p === 'bbox' ? -2 : 0) + 'px';
        });
      });

      const countEl = document.getElementById('vehCount');
      const latencyEl = document.getElementById('latency');
      if (countEl) countEl.textContent = vCount.toString();
      if (latencyEl) latencyEl.textContent = Math.floor(10 + Math.random() * 6) + 'ms';

      animationFrameId = requestAnimationFrame(animVehicles);
    };

    animVehicles();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // --- HANDLERS ---
  const handleModalClose = () => {
    setIsModalOpen(false);
    setTimeout(() => setIsSubmitted(false), 300); // Reset after animation
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Log that submission is starting (This is what you saw at line 116)
    console.log("Submitting form data:", formData, selectedServices);

    try {
      // 2. Await the server action response
      const result = await submitDemoRequest(formData, selectedServices);

      // 3. Log exactly what the backend returns
      console.log("Backend response received:", result);

      if (result && result.success) {
        console.log("Successfully saved to database!", result.data);
        setIsSubmitted(true); // <-- ONLY change UI to confirmed if database says YES
      } else {
        console.error("Server Action returned a failure:", result?.error);
        alert(`Could not save lead: ${result?.error || 'Unknown error'}`);
      }
    } catch (err) {
      // 4. Catch any network or silent crashes
      console.error("Critical error during submission:", err);
      alert("A critical error occurred. Check your terminal logs!");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleServiceSelection = (id: string) => {
    setSelectedServices(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </Head>

      <nav>
        <a className="nav-logo" href="#">
          <div className="logo-container">
            {/* REPLACE THIS SVG WITH YOUR ACTUAL SVG LOGO */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="500"
              height="500"
              version="1"
              viewBox="0 0 375 375"
            >
              <defs>
                <clipPath id="92cbf065f0">
                  <path d="M164 136h125.648v115H164Zm0 0"></path>
                </clipPath>
                <clipPath id="36631299b3">
                  <path d="M78.898 156H228v95H78.898Zm0 0"></path>
                </clipPath>
                <clipPath id="edd77bf881">
                  <path d="M44.273 9.492H212v67.5H44.273Zm0 0"></path>
                </clipPath>
                <clipPath id="d6ae59394f">
                  <path d="M94 .492h73.98v67.5H94Zm0 0"></path>
                </clipPath>
                <clipPath id="0c59f705d6">
                  <path d="M48 .492h74v67.5H48Zm0 0"></path>
                </clipPath>
                <clipPath id="3e8fcf055c">
                  <path d="M2 .492h74v67.5H2Zm0 0"></path>
                </clipPath>
                <clipPath id="8e1bffc1d8">
                  <path d="M.273.492H30v67.5H.273Zm0 0"></path>
                </clipPath>
                <clipPath id="9dd94fd8b3">
                  <path d="M0 0h168v68H0z"></path>
                </clipPath>
                <clipPath id="a18b31a99f">
                  <path d="M0 0h212v86H0z"></path>
                </clipPath>
                <clipPath id="f6ca2bcccd">
                  <path d="M116 194.816h31v34.5h-31Zm0 0"></path>
                </clipPath>
                <clipPath id="e69d17cab7">
                  <path d="M168.906 106h30.75v27h-30.75Zm0 0"></path>
                </clipPath>
                <clipPath id="567c80bf06">
                  <path d="M169 160.086h31v33h-31Zm0 0"></path>
                </clipPath>
                <clipPath id="77e254338b">
                  <path d="M219.727 193.316h37.5v36h-37.5Zm0 0"></path>
                </clipPath>
                <filter id="380aa8d694" width="100%" height="100%" x="0%" y="0%">
                  <feColorMatrix
                    colorInterpolationFilters="sRGB"
                    values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
                  ></feColorMatrix>
                </filter>
                <mask id="dce176e0a8">
                  <g filter="url(#380aa8d694)">
                    <path fillOpacity="0.9" d="M-37.5-37.5h450v450h-450z"></path>
                  </g>
                </mask>
              </defs>
              <g clipPath="url(#92cbf065f0)">
                <path d="M196.785 241.273c4.88-4.222 9.383-8.168 13.969-12.023.426-.355 1.422-.324 2.043-.121 10.633 3.43 21.566 4.992 32.656 4.008 7.008-.625 13.95-2.219 20.844-3.727 3.441-.754 5.043-4.023 4.207-7.515-3.727-15.583-10.938-29.305-21.977-40.977-13.488-14.262-29.98-22.961-49.207-26.477-10.746-1.964-21.52-1.761-32.246.348-.726.14-1.46.246-2.851.48-.024-5.59-.086-10.878.011-16.167.008-.461 1.059-1.188 1.711-1.301 14.594-2.492 29.114-2.168 43.496 1.476 25.875 6.559 46.5 20.809 61.696 42.727 10.539 15.203 16.605 32.117 18.074 50.61.437 5.519.418 5.616-4.652 7.913-24.82 11.25-50.274 13.012-76.325 4.852-3.816-1.195-7.535-2.691-11.449-4.106m0 0"></path>
              </g>
              <path d="M233.203 134.18c-5.73-1.989-11.414-3.895-17.027-5.996-.668-.25-1.188-1.485-1.375-2.348q-4.184-19.314-16.301-34.895c-3.027-3.89-6.504-7.453-9.957-10.992-2.34-2.398-6.027-2.344-8.484-.07a87.3 87.3 0 0 0-11.786 13.336 87.5 87.5 0 0 0-8.847 15.441c-6.653 14.856-9.16 30.453-7.184 46.617 2.192 17.918 9.117 33.86 20.961 47.579.5.578 1.004 1.144 1.492 1.73.09.11.114.273.414 1.02-4.539 2.656-9.144 5.394-13.82 8.007-.351.196-1.375-.308-1.762-.761q-14.026-16.506-20.265-37.266c-4.942-16.398-6.028-33.074-2.79-49.934 4.489-23.355 15.47-43.152 33.15-59.082 4.167-3.757 8.87-6.925 13.417-10.238.563-.41 1.902-.387 2.516.008q24.17 15.568 37.101 41.285c5.703 11.281 9.09 23.207 10.594 35.715.035.285-.031.586-.047.844m0 0"></path>
              <g clipPath="url(#36631299b3)">
                <path d="M122.637 156.086c.84 4.637 1.261 9.059 2.496 13.242 1.183 4.012.262 6.469-2.809 9.395-12.328 11.75-20.144 26.226-24.195 42.754-.977 3.976.691 6.98 4.598 8.117 18.136 5.285 36.246 5.308 54.125-.969 27.308-9.59 45.722-28.238 55.48-55.477.203-.566.422-1.125.844-2.25 4.133 2.243 8.152 4.313 12.058 6.575 2.993 1.73 2.97 1.851 1.707 5.054-10.558 26.762-28.726 46.582-54.96 58.328-30.676 13.735-61.34 12.735-91.555-2.027-1.281-.625-1.528-1.371-1.442-2.648Q82 191.444 115.52 161.715c2.207-1.953 4.625-3.664 7.117-5.63m0 0"></path>
              </g>
              <g mask="url(#dce176e0a8)">
                <g clipPath="url(#a18b31a99f)" transform="translate(58 250)">
                  <g clipPath="url(#edd77bf881)">
                    <g clipPath="url(#9dd94fd8b3)" transform="translate(44 9)">
                      <g clipPath="url(#d6ae59394f)">
                        <path
                          fill="#65ff12"
                          d="M167.93 33.82 94.21-8.762v22.5l34.743 20.082-34.742 20.04v22.538Zm0 0"
                        ></path>
                      </g>
                      <g clipPath="url(#0c59f705d6)">
                        <path
                          fill="#26d827"
                          d="M121.875 33.82 48.156-8.762v22.5L82.898 33.82 48.156 53.86v22.538Zm0 0"
                        ></path>
                      </g>
                      <g clipPath="url(#3e8fcf055c)">
                        <path
                          fill="#139618"
                          d="M75.863 33.82 2.102-8.762v22.5L36.887 33.82 2.102 53.86v22.538Zm0 0"
                        ></path>
                      </g>
                      <g clipPath="url(#8e1bffc1d8)">
                        <path
                          fill="#0e4d11"
                          d="m29.809 33.82-73.72-42.582v22.5L-9.167 33.82-43.91 53.86v22.538Zm0 0"
                        ></path>
                      </g>
                    </g>
                  </g>
                </g>
              </g>
              <g clipPath="url(#f6ca2bcccd)">
                <path d="M131.45 194.816c-5.235 0-9.65.29-10.305.672-1.153.395-2.016 3.008-2.02 6.106v1.539h-.312a.9.9 0 0 0-.13-.196.84.84 0 0 0 .212-.562v-.782c.003-.023.003-.042.003-.07 0-.359-.27-.656-.617-.699h-1.234a.71.71 0 0 0-.613.774v.78a.86.86 0 0 0 .21.567l-.003-.004a.87.87 0 0 0-.211.563v3.933c0 .36.27.657.617.7h1.234a.6.6 0 0 0 .528-.383l.004-.004h.312v6.934c0 .273.297.527.77.664v.898c-.68.09-1.149.395-1.149.746v7.703a3 3 0 0 0-.008.211c0 .918.293 1.77.785 2.469l-.007-.012v1.325c0 .347.285.632.632.632h2.586a.635.635 0 0 0 .633-.632v-.91h16.168v.91c0 .347.281.632.63.632h2.585a.633.633 0 0 0 .633-.632v-1.325a4.24 4.24 0 0 0 .77-2.672v.008-7.703c0-.351-.473-.656-1.15-.746v-.898c.477-.137.77-.391.77-.668v-6.926h.313a.6.6 0 0 0 .531.383h1.23a.7.7 0 0 0 .618-.7q.001-.04-.004-.074v.004-3.863a.86.86 0 0 0-.207-.563.87.87 0 0 0 .21-.562v-.848c0-.36-.265-.66-.612-.703h-1.239a.71.71 0 0 0-.613.777v-.004.782a.86.86 0 0 0 .21.566l-.003-.004a1 1 0 0 0-.125.192v.004h-.312v-1.547c0-3.118-.875-5.739-2.036-6.114-.703-.382-5.093-.664-10.285-.664Zm-10.563 4.47h21.12c.376 0 .684.26.755.612l.004.008c.144.73.23 1.574.23 2.438v5.41c0 .426-.348.77-.773.77h-21.555a.77.77 0 0 1-.773-.77v-5.406c0-.864.085-1.707.246-2.524l-.016.082a.77.77 0 0 1 .758-.62Zm.933 16.94h1.653c.203 0 .37.16.382.364l.274 5.008v.02c0 .21-.172.382-.387.382h-1.922a.387.387 0 0 1-.386-.383v-5.008c0-.21.175-.382.386-.382m17.602 0h1.652c.211 0 .383.172.383.383v5.004c0 .211-.172.383-.383.383h-1.926a.384.384 0 0 1-.386-.383v-.023.004l.277-5.008c.012-.2.18-.36.383-.36m-14.328.919H137.8c.105 0 .191.085.191.195v.23a.19.19 0 0 1-.191.192h-12.707a.19.19 0 0 1-.192-.192v-.23c0-.11.086-.195.192-.195m.078 1.386h12.55c.106 0 .196.086.196.192v.23c0 .11-.09.195-.195.195h-12.551a.193.193 0 0 1-.195-.195v-.23c0-.106.085-.192.195-.192m.074 1.387h12.402c.106 0 .192.086.192.191v.23a.19.19 0 0 1-.192.192h-12.402a.196.196 0 0 1-.191-.183v-.23c0-.106.09-.192.195-.192Zm.078 1.387h12.246c.106 0 .192.086.192.191v.23a.19.19 0 0 1-.192.192h-12.246a.19.19 0 0 1-.191-.191v-.23c0-.106.086-.192.191-.192m0 0"></path>
              </g>
              <g clipPath="url(#e69d17cab7)">
                <path
                  fillRule="evenodd"
                  d="M198.422 116.75v15.32h-3.578v-2.367h-21.121v2.367h-3.582v-15.32h-1.235v-2.355h3.012l1.68-5.223c.496-1.543 1.324-2.942 2.937-2.942h16.113c1.618 0 2.551 1.372 2.942 2.938l1.297 5.227h2.77v2.351h-1.235Zm-19.504 8.227h10.578v2.492h-10.578Zm-7.578-5.813c2.695.086 4.344 1.215 4.765 3.57h-4.765Zm25.543 0c-2.696.086-4.344 1.215-4.766 3.57h4.766Zm-23.676-4.77h22.152l-.949-4.382c-.262-1.203-1.008-2.242-2.242-2.242h-15.316c-1.235 0-1.864 1.066-2.243 2.242Zm0 0"
                ></path>
              </g>
              <g clipPath="url(#567c80bf06)">
                <path d="M198.426 172.672c-.43-.668-.668-2.113-.617-2.996.125-2.055-.965-4.098-2.657-4.965-.324-.168-.617-.25-.875-.324-.445-.13-.629-.184-.797-.532-.71-1.48-1.5-2.003-3.003-2.003-.22 0-.457.007-.73.027-.157 0-.4-.262-.634-.512-.414-.441-.96-1.027-1.832-1.129l-.281-.027c-.934 0-1.836.277-2.477.762-.148.113-.324.21-.558.004-.488-.43-1.278-.891-2.012-.891q-.383 0-.683.164c-.864.172-1.418.719-1.829 1.125-.27.27-.504.5-.707.5q-.39-.023-.722-.023c-1.504 0-2.29.523-3 2.003-.024.047-.051.079-.075.114h.43a2.78 2.78 0 0 1 2.778 2.773.554.554 0 1 1-1.11 0c0-.918-.75-1.664-1.668-1.664h-2.617c-1.348.996-2.18 2.793-2.07 4.598.054.883-.184 2.328-.614 2.996-1.058 1.644-1.058 3.945 0 5.594.164.254.403.547.68.89.266.328.621.77.895 1.188l1.054-1.5c.79-1.313 2.211-2.114 3.782-2.114a3.337 3.337 0 0 0 3.332-3.328.555.555 0 1 1 1.109 0 4.445 4.445 0 0 1-4.441 4.438 3.31 3.31 0 0 0-2.852 1.61l-1.59 2.257c.063 1.957 1.266 4.074 2.824 4.875.305.156.356.313.47.79.01.05.026.108.038.163v-.265a3.89 3.89 0 0 1 3.883-3.883c.309 0 .555.246.555.554a.55.55 0 0 1-.555.555 2.78 2.78 0 0 0-2.773 2.774v2.042c.296.208.601.325.859.422.52.196.734.278.812.848.215 1.566 1.145 2.504 2.485 2.504 1.191 0 2.48-.805 3.285-2.055a.38.38 0 0 1 .328-.168c.063 0 .227.016.324.168.805 1.25 2.094 2.055 3.29 2.055 1.03 0 2.226-.656 2.484-2.504.078-.57.293-.652.812-.848.524-.199 1.239-.472 1.696-1.422.168-.351.246-.68.312-.94.113-.477.164-.634.465-.79 1.68-.863 2.945-3.25 2.82-5.324-.027-.465.801-1.488 1.297-2.102.277-.34.516-.636.68-.89 1.058-1.649 1.058-3.95 0-5.594m-16.848 9.68a.559.559 0 0 1-.394.949.54.54 0 0 1-.391-.164 3.73 3.73 0 0 1-1.102-2.657c0-1 .391-1.94 1.102-2.652a.55.55 0 0 1 .785 0 .56.56 0 0 1 0 .785c-.5.5-.777 1.164-.777 1.867 0 .708.277 1.372.777 1.872m.004-13.903a2.645 2.645 0 0 0-3.062 2.145 3.764 3.764 0 0 1-4.348 3.05.56.56 0 0 1-.453-.644c.054-.3.34-.5.644-.45a2.65 2.65 0 0 0 3.063-2.148 3.76 3.76 0 0 1 4.347-3.047c.301.051.504.34.45.641-.051.3-.34.5-.641.453m14.867-.883a.554.554 0 1 1 0 1.11.554.554 0 0 1 0-1.11m-9.984 13.313a.554.554 0 1 1 0-1.109.554.554 0 0 1 0 1.109m.555 3.887c0 .304-.25.554-.555.554a.554.554 0 1 1 .555-.555m6.101-8.325a.554.554 0 1 1 0-1.108.554.554 0 0 1 0 1.108m.555 1.664a.554.554 0 1 1-1.11 0 .554.554 0 0 1 1.11 0m-.555-3.882a.554.554 0 1 1 0-1.109.554.554 0 0 1 0 1.109m-1.11-1.11a.557.557 0 0 1-.554-.554.554.554 0 1 1 .555.555m1.11-1.11a.557.557 0 0 1-.555-.554.554.554 0 1 1 .555.555m-1.11-4.437a.554.554 0 1 1 0 1.11.554.554 0 0 1 0-1.11m-.554-1.664a.554.554 0 1 1 1.109 0 .554.554 0 0 1-1.109 0m-.555 1.664a.554.554 0 1 1 0-1.11.554.554 0 0 1 0 1.11m0 3.329a.554.554 0 1 1 .001 1.108.554.554 0 0 1 0-1.108m-2.218 1.109a.557.557 0 0 1-.555-.555c0-.304.25-.554.555-.554a.554.554 0 1 1 0 1.11m1.109 2.219a.554.554 0 1 1 0 1.108.554.554 0 0 1 0-1.108m-1.11 1.109a.554.554 0 1 1 0 1.11.554.554 0 0 1 0-1.11m-1.109-1.11a.554.554 0 1 1 0 1.11.554.554 0 0 1 0-1.11m-.554-1.663c0-.305.25-.555.554-.555s.555.25.555.555c0 .304-.25.554-.555.554a.557.557 0 0 1-.554-.554m.554 3.882a.554.554 0 1 1 0 1.11.554.554 0 0 1 0-1.11m1.11 3.329a.554.554 0 1 1 0 0m1.109-2.22a.554.554 0 1 1 0-1.108.554.554 0 0 1 0 1.109m.555 6.106a.554.554 0 1 1-1.109.001.554.554 0 0 1 1.109 0m.554-6.105a.554.554 0 1 1 .001 1.108.554.554 0 0 1 0-1.108m-1.109-8.875a.554.554 0 1 1 0-1.11.554.554 0 0 1 0 1.11m-1.11-2.219a.554.554 0 1 1 .001 1.109.554.554 0 0 1 0-1.109m-.554-1.664a.554.554 0 1 1 1.109 0 .554.554 0 0 1-1.11 0m.555 3.883c.304 0 .554.25.554.554s-.25.555-.554.555a.554.554 0 1 1 0-1.11m-1.11 0a.554.554 0 1 1 0-1.11.554.554 0 0 1 0 1.11m-1.11-1.11a.554.554 0 1 1 0-1.11.554.554 0 0 1 0 1.11m0 1.11c.306 0 .556.25.556.554s-.25.555-.555.555a.554.554 0 1 1 0-1.11m0 2.219c.306 0 .556.25.556.554s-.25.555-.555.555a.554.554 0 1 1 0-1.11m0 2.218a.554.554 0 1 1-.555.555c.001-.305.251-.555.556-.555m0 4.438a.554.554 0 1 1-.555.555c.001-.305.251-.555.556-.555m1.11 5.55a.554.554 0 1 1 .001 1.11.554.554 0 0 1 0-1.11m1.11 0a.554.554 0 1 1 0-1.11.554.554 0 0 1 0 1.11m.554 6.102c0 .305-.25.555-.554.555a.554.554 0 1 1 .555-.555m.555-2.773a.554.554 0 1 1 0-1.11.554.554 0 0 1 0 1.11m.555 1.664a.554.554 0 1 1-1.109 0 .554.554 0 0 1 1.109 0m.554-1.664a.554.554 0 1 1 0 1.11.554.554 0 0 1 0-1.11m0-5.551a.554.554 0 1 1 0-1.109.554.554 0 0 1 0 1.109m1.11 2.223a.554.554 0 1 1 0 0m0-7.77a.554.554 0 1 1-.001-1.109.554.554 0 0 1 0 1.109m1.11 5.547a.554.554 0 1 1-.002-1.109.554.554 0 0 1 .001 1.109m.554 1.668a.554.554 0 1 1-1.109 0 .554.554 0 0 1 1.109 0m.554-1.668c.31 0 .555.25.555.555a.555.555 0 1 1-1.11 0c0-.305.25-.555.555-.555m0-7.766a.557.557 0 0 1-.554-.554.554.554 0 1 1 .555.555m0-3.328a.554.554 0 1 1 .001 1.109.554.554 0 0 1 0-1.109m-.554-1.664a.554.554 0 1 1 1.108 0 .554.554 0 0 1-1.108 0m1.664 8.32a.554.554 0 1 1 0-1.108.554.554 0 0 1 0 1.108m.555 1.664a.554.554 0 1 1-1.11 0 .554.554 0 0 1 1.11 0m-.555-8.32a.557.557 0 0 1-.555-.555.554.554 0 1 1 .555.555m1.11 3.328a.557.557 0 0 1-.555-.554.554.554 0 1 1 .555.555m.554 1.664a.554.554 0 1 1-1.11 0 .554.554 0 0 1 1.11 0m-.555-3.882a.557.557 0 0 1-.554-.555.554.554 0 1 1 .555.555m-1.11-4.438a.554.554 0 1 1-.555.555c.001-.309.251-.555.556-.555m-1.109-1.11a.554.554 0 1 1 0 1.11.554.554 0 0 1 0-1.11m-1.109-1.109a.554.554 0 1 1 0 1.11.554.554 0 0 1 0-1.11m-1.11-1.11c.31 0 .555.247.555.556a.554.554 0 1 1-.554-.555m-1.109-1.108a.554.554 0 1 1 0 1.11.554.554 0 0 1 0-1.11m-1.109 1.109a.554.554 0 1 1 0 1.11.554.554 0 0 1 0-1.11m-1.11-1.11a.554.554 0 1 1 .001 1.11.554.554 0 0 1 0-1.11m-1.109-1.109a.554.554 0 1 1 .001 1.109.554.554 0 0 1 0-1.109m-1.11 1.11a.554.554 0 1 1 .002 1.108.554.554 0 0 1-.001-1.108m-1.109-1.11a.554.554 0 1 1 .001 1.109.554.554 0 0 1 0-1.109m0 2.219a.554.554 0 1 1 .001 1.109.554.554 0 0 1 0-1.11m0 2.219a.554.554 0 1 1 .001 1.108.554.554 0 0 1 0-1.108m0 4.437c.305 0 .555.25.555.555s-.25.555-.555.555a.554.554 0 1 1 0-1.11m0 4.438a.554.554 0 1 1 0 1.11.554.554 0 0 1 0-1.11m0 2.218a.554.554 0 1 1 0 1.11.554.554 0 0 1 0-1.11m0 2.22a.554.554 0 1 1 0 1.11.554.554 0 0 1 0-1.11m0 2.218a.557.557 0 0 1 0 1.113.558.558 0 0 1 0-1.113m0 2.223a.554.554 0 1 1 .001 1.108.554.554 0 0 1 0-1.108m0 2.218a.554.554 0 1 1 .001 1.109.554.554 0 0 1 0-1.109m0 2.22a.554.554 0 1 1 .001 1.108.554.554 0 0 1 0-1.109m0 3.327a.554.554 0 1 1 0-1.11.554.554 0 0 1 0 1.11m1.11 1.11a.557.557 0 0 1-.555-.555c0-.305.25-.555.555-.555s.555.25.555.555-.25.555-.555.555m0-2.22a.554.554 0 1 1 0-1.11.554.554 0 0 1 0 1.11m1.11-1.109a.554.554 0 1 1 0-1.11.554.554 0 0 1 0 1.11m1.109 3.329a.557.557 0 0 1-.555-.555c0-.305.25-.555.555-.555a.554.554 0 1 1 0 1.11m1.109-1.11a.554.554 0 1 1 0-1.11.554.554 0 0 1 0 1.11m1.11-1.11a.554.554 0 1 1 0-1.11.554.554 0 0 1 0 1.11m1.109-1.109a.554.554 0 1 1 0-1.11.554.554 0 0 1 0 1.11m0-2.218a.554.554 0 1 1 0-1.11.554.554 0 0 1 0 1.11m1.11-1.11a.554.554 0 1 1 0-1.11.554.554 0 0 1 0 1.11m1.108-1.11a.554.554 0 1 1 0-1.11.554.554 0 0 1 0 1.11m1.11-1.108a.554.554 0 1 1 0-1.11.554.554 0 0 1 0 1.11m0-2.223a.554.554 0 1 1 0-1.109.554.554 0 0 1 0 1.109m1.11-1.11a.554.554 0 1 1-.002-1.108.554.554 0 0 1 .001 1.109m1.109-1.109a.554.554 0 1 1 0-1.11.555.555 0 1 1 0 1.11m0-2.219a.554.554 0 1 1 0-1.109.555.555 0 1 1 0 1.11m0-2.218a.554.554 0 1 1 0-1.11.555.555 0 1 1 0 1.11m0 0"></path>
              </g>
              <g clipPath="url(#77e254338b)">
                <path
                  fill="#100f0d"
                  d="M251.332 214.07c0 .672-.426 1.27-1.059 1.485-3.02 1.007-7.191 1.632-11.796 1.632-4.61 0-8.782-.625-11.801-1.632a1.57 1.57 0 0 1-1.059-1.485v-12.98c0-.785.633-1.426 1.414-1.426h22.887c.781 0 1.414.64 1.414 1.426Zm0 6.254c0 1.586-1.488 2.875-3.324 2.875h-4.149c-.968 0-1.28-1.129-.414-1.504l6.602-2.863c.59-.258 1.285.113 1.285.688ZM233.09 223.2h-4.149c-1.836 0-3.324-1.289-3.324-2.875v-.804c0-.575.696-.946 1.285-.688l6.602 2.863c.867.375.555 1.504-.414 1.504m-1.422-27.453a.42.42 0 0 1 .422-.422h12.773a.42.42 0 0 1 .418.422v2.05a.42.42 0 0 1-.418.423H232.09a.42.42 0 0 1-.422-.422Zm24.887 6.816h-.395v-.359c0-.668-.543-1.215-1.207-1.215h-1.492v-3.48c0-.457-.098-.89-.274-1.281-.41-.918-1.269-1.54-2.246-1.735l-.543-.105c-5.757-1.067-11.921-.84-11.921-.84s-6.165-.227-11.926.84l-.543.105c-.973.196-1.836.817-2.246 1.735-.172.39-.274.824-.274 1.28v3.481h-1.492c-.664 0-1.207.547-1.207 1.215v.36h-.394a.664.664 0 0 0-.665.667v5.223c0 .367.297.668.665.668h1.699c.367 0 .664-.3.664-.668v-5.223a.664.664 0 0 0-.664-.667h-.395v-.36a.3.3 0 0 1 .297-.3h1.492v20.23c0 1.637.965 3.043 2.352 3.676v2.71c0 .442.355.801.793.801h4.125c.437 0 .789-.36.789-.8v-2.348h13.855v2.348c0 .44.356.8.793.8h4.125c.438 0 .793-.36.793-.8v-2.711a4.04 4.04 0 0 0 2.348-3.676v-20.23h1.492c.164 0 .3.136.3.3v.36h-.398a.664.664 0 0 0-.66.667v5.223c0 .367.297.668.66.668h1.7c.367 0 .664-.3.664-.668v-5.223a.664.664 0 0 0-.664-.667"
                ></path>
              </g>
              <path d="M109.795 281.064h2.578q.669.002 1.015.078c.47.063.786.196.953.391q.249.346.25 1.063 0 .282-.046.875-.034.596-.172 1.515l-.266 1.813h6.172q-.252 1.798-.422 2.406-.206.783-.734 1.156-.363.222-.985.297c-.18.023-.468.04-.875.047a55 55 0 0 1-1.53.016h-2.173l-.14 1.03-.563 3.954-.14 1.016h6.156a31 31 0 0 1-.219 1.453q-.095.58-.172.89-.175.704-.531 1.063-.315.314-1.094.453c-.398.055-1.18.078-2.344.078h-2.53c-1.212 0-2.013-.023-2.407-.078-.5-.094-.836-.258-1-.5q-.174-.31-.172-.813v-.453q.076-.56.328-2.093l.14-1.016.563-3.953.14-1.031h-3.968c.094-.54.164-.993.219-1.36l.11-.797c.163-.664.41-1.125.734-1.375q.419-.246 1.109-.328a3.6 3.6 0 0 1 .719-.062h1.64l.563-4.032q.03-.215.031-.343v-.188q-.002-.246-.062-.328a.7.7 0 0 0-.11-.187.7.7 0 0 0-.203-.188.8.8 0 0 0-.187-.187zM122.855 290.752q.247-1.594.329-2.11c.132-.593.32-1.007.562-1.25q.329-.387 1.031-.484.591-.076 1.985-.078h10.765a81 81 0 0 1-.218 1.437 7 7 0 0 1-.188.86c-.148.562-.351.945-.61 1.14q-.362.345-1.265.422a9 9 0 0 1-.844.047 49 49 0 0 1-1.453.016h-5.281q-.206 0-.313.031a.57.57 0 0 0-.328.11q-.14.046-.234.328a1.6 1.6 0 0 0-.063.265 5 5 0 0 1-.078.438l-.672 4.843q-.187 1.564-.328 2.125c-.062.25-.132.477-.203.672a1.7 1.7 0 0 1-.281.485c-.2.218-.484.386-.86.5-.187.043-.523.078-1 .109q-.721.033-1.859.031ZM151.151 286.799q1.23 0 1.735.093c.414.055.695.141.843.266q.423.284.422 1.188v.171c0 .055-.011.125-.03.22 0 .167-.024.417-.063.75q-.05.503-.157 1.265l-.453 3.14-.39 2.844q-.112 1.02-.235 1.64-.129.628-.234.938-.176.598-.563.907c-.21.148-.515.265-.922.359a22 22 0 0 1-.953.078q-.673.033-1.734.031h-6.078q-1.019.002-1.656-.031-.644-.045-.954-.078-.598-.14-.843-.422c-.149-.207-.219-.535-.219-.984v-.172q.061-.576.25-2.266l.172-1.031c.07-.5.133-.914.187-1.25q.092-.515.125-.766.186-.982.547-1.343.389-.387 1.094-.47.592-.093 2.156-.093h5.86q.168.001.296-.016c.083-.007.13-.015.141-.015a.43.43 0 0 0 .266-.14q.077-.077.078-.25.06-.153.078-.61h-6.156c-.5 0-.93-.004-1.282-.016a7 7 0 0 1-.765-.047q-.72-.106-1.031-.5-.252-.389-.344-1.281c0-.176-.008-.398-.016-.672V286.8Zm-7.453 8.906q-.361.001-.406.031c-.063 0-.133.04-.203.11q-.063.063-.11.421 0 .14-.078.47h5.766q.14-.015.156-.016.17-.031.203-.125.061-.047.11-.282.058-.151.093-.61ZM161.092 286.799h10.531a15 15 0 0 1-.25 1.562q-.128.598-.203.906-.176.534-.422.844-.33.362-1.062.531c-.399.055-1.266.079-2.61.079h-5.406a.9.9 0 0 0-.25.03q-.222 0-.297.048a.7.7 0 0 0-.234.312 2 2 0 0 0-.032.25c-.011.094-.039.227-.078.39l-.703 4.97h10.14q-.187 1.61-.327 2.171-.177.846-.563 1.235-.316.314-1.125.453c-.387.055-1.21.078-2.469.078h-6.203l-.25 1.766q-.128.78-.203 1.312-.082.528-.14.844-.08.34-.172.594a1.5 1.5 0 0 1-.22.437q-.314.481-1.062.656-.28.048-.984.094a27 27 0 0 1-1.766.047l1.063-7.656 1.156-8.031c.094-.594.164-1.086.219-1.485q.076-.59.14-.86.247-.871.735-1.187.388-.292 1.11-.328.31-.06.78-.062zM178.142 286.799h10.53a15 15 0 0 1-.25 1.562q-.127.598-.202.906-.176.534-.422.844-.329.362-1.063.531c-.398.055-1.265.079-2.609.079h-5.406a.9.9 0 0 0-.25.03q-.222 0-.297.048a.7.7 0 0 0-.235.312 2 2 0 0 0-.03.25c-.012.094-.04.227-.079.39l-.703 4.97h10.14q-.186 1.61-.328 2.171-.175.846-.562 1.235-.317.314-1.125.453c-.387.055-1.211.078-2.469.078h-6.203l-.25 1.766q-.128.78-.203 1.312-.083.528-.14.844-.08.34-.173.594a1.5 1.5 0 0 1-.218.437q-.315.481-1.063.656-.28.048-.984.094a27 27 0 0 1-1.766.047l1.063-7.656L174 290.72c.094-.594.164-1.086.219-1.485q.075-.59.14-.86.247-.871.735-1.187.388-.292 1.11-.328.31-.06.78-.062zM196.535 281.096l-.64 4.671h-3.985l.094-.765c.094-.531.164-.973.219-1.328q.075-.546.14-.797c.133-.594.32-1.008.563-1.25q.357-.373 1.031-.453.592-.077 2.578-.078m-4.765 5.703h3.984l-.813 5.656-.593 4.312a54 54 0 0 1-.328 1.985q-.112.704-.391 1.125-.346.503-1.125.672-.284.064-.953.109-.675.033-1.735.031l1-7.11ZM202.557 286.83h10.531q-.127.843-.218 1.406-.095.55-.172.86c-.117.542-.305.93-.563 1.156q-.456.392-1.468.469-.27.002-.797.015c-.344.012-.79.016-1.328.016h-5.5a.7.7 0 0 0-.297.047.34.34 0 0 0-.25.093q-.08.082-.172.329-.001.14-.078.562l-.703 4.953h10.14a29 29 0 0 1-.219 1.5q-.094.58-.171.89c-.118.524-.313.891-.594 1.11q-.392.316-1.235.39a8 8 0 0 1-.828.048q-.563.016-1.437.015h-6.266q-1.018.002-1.656-.031-.644-.045-.953-.078-.58-.17-.844-.5-.187-.342-.187-.906v-.188q.03-.31.093-.86.077-.545.188-1.39l.187-1.437a1189 1189 0 0 0 .532-3.75c.062-.414.101-.68.125-.797q.246-1.686.328-2.188.217-.89.593-1.234c.282-.238.649-.383 1.11-.438a4.6 4.6 0 0 1 .828-.062zM215.292 290.783l.234-1.39a8 8 0 0 0 .125-.797q.247-.89.594-1.235.45-.387 1.312-.469.312-.06.875-.062h8.766q.497.002.719.062.234.001.422.032.2.018.312.078.422.081.563.281.326.25.36.86v1.124q0 .189-.048.579-.034.375-.094.937l-.5 3.5-.343 2.484-.563 3.922-.25 1.813q-.08.731-.172 1.234c-.054.344-.093.613-.125.813q-.175.841-.562 1.297-.346.387-1.063.5-.282.029-.953.062c-.437.031-.992.047-1.656.047h-10.14q.204-.892.343-1.484.142-.58.219-.86c.21-.625.476-1.039.812-1.234q.342-.235 1.094-.313c.188-.043.43-.062.734-.062h5.922c.27 0 .489-.008.657-.016h.359c.207-.062.348-.133.422-.203.094-.094.164-.262.219-.5q.092-.25.171-1.094h-6.437q-.784 0-1.328-.015a9 9 0 0 1-.828-.047q-.846-.153-1.094-.61-.174-.31-.172-.843-.001-.141.016-.282.014-.14.015-.28.059-.248.094-.704c.031-.312.07-.691.125-1.14q.061-.28.11-.672.059-.387.124-.891.077-.53.125-.906.059-.388.094-.641.216-1.419.297-2.14.094-.716.094-.735m4.984 0q-.534.002-.64.016-.205 0-.282.14-.035.035-.14.344-.001.11-.078.531l-.344 2.375-.328 2.578h5.093q.218 0 .375-.015c.102-.008.18-.016.235-.016q.248-.045.312-.11.106-.043.141-.218.045-.093.078-.25.03-.169.063-.39l.703-4.985ZM243.652 286.799q1.23 0 1.734.093c.414.055.695.141.844.266q.421.284.422 1.188v.171c0 .055-.012.125-.032.22q-.002.25-.062.75c-.031.335-.086.757-.156 1.265l-.454 3.14-.39 2.844q-.111 1.02-.235 1.64-.129.628-.234.938-.176.598-.562.907c-.211.148-.516.265-.922.359a22 22 0 0 1-.953.078q-.675.033-1.735.031h-6.078q-1.018.002-1.656-.031-.644-.045-.953-.078-.598-.14-.844-.422c-.149-.207-.219-.535-.219-.984v-.172q.061-.576.25-2.266l.172-1.031c.07-.5.133-.914.188-1.25.062-.344.101-.598.125-.766.125-.656.304-1.101.546-1.343q.389-.387 1.094-.47.592-.093 2.156-.093h5.86q.168.001.297-.016c.082-.007.129-.015.14-.015a.43.43 0 0 0 .266-.14q.077-.077.078-.25.06-.153.078-.61h-6.156c-.5 0-.93-.004-1.281-.016a7 7 0 0 1-.766-.047q-.72-.106-1.031-.5-.25-.389-.344-1.281c0-.176-.008-.398-.016-.672V286.8Zm-7.454 8.906q-.361.001-.406.031c-.062 0-.133.04-.203.11q-.063.063-.11.421-.001.14-.077.47h5.765q.14-.015.156-.016.17-.031.204-.125c.039-.032.078-.125.109-.282q.058-.151.094-.61ZM249.623 290.783q.124-.983.219-1.578.106-.61.172-.89.248-.812.672-1.094.326-.247 1-.329.246-.06.656-.062h9.782q.403.002.655.062c.383.055.657.153.813.297q.328.252.39.985v.203q-.001.55-.25 2.406l-.14 1-.563 3.953-.14 1.031q-.11.844-.203 1.407a7 7 0 0 1-.157.828q-.095.345-.203.61a1.3 1.3 0 0 1-.28.437q-.33.363-1.032.53a22 22 0 0 1-.953.079 34 34 0 0 1-1.703.031l.546-3.922.141-1.03.563-3.954.14-1h-5.125a.8.8 0 0 0-.203-.031h-.187c-.118 0-.188.011-.22.031a.6.6 0 0 0-.28.078 1 1 0 0 0-.204.344q0 .11-.078.578l-.562 3.953-.14 1.031a20 20 0 0 1-.235 1.532q-.128.596-.203.906-.175.675-.625 1.031-.363.251-1.125.39-.269.036-.86.048c-.398.011-.89.015-1.484.015l.562-3.922.141-1.03.563-3.954Zm0 0"></path>
            </svg>
          </div>
          <span className="logo-text">TRAFFICGAN</span>
        </a>
        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#technology">Technology</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <button className="nav-cta" onClick={() => setIsModalOpen(true)}>Request Demo</button>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-glow"></div>
        <div className="hero-content">
          <h1 className="hero-h">PERCEPTION<br />DRIVES<br /><span>MOBILITY</span></h1>
          <p className="hero-sub">AI-Enhanced traffic monitoring services.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => setIsModalOpen(true)}>Request Demo →</button>
            <button className="btn-secondary" onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })}>See How It Works</button>
          </div>
        </div>

        <div className="hero-viz">
          <div className="viz-header"><span className="viz-dot"></span>CAM_07 — DOWNTOWN INTERCHANGE — LIVE</div>
          <div className="viz-canvas" id="vizCanvas">
            <div className="road"></div>
            {/* Vehicles injected dynamically by React to match original styling structure */}
            {[{ id: 0, y: 62, w: 48, h: 20, color: '#65FF12', lbl: 'SEDAN·0.97', emoji: '🚗' }, { id: 1, y: 70, w: 66, h: 24, color: '#26D827', lbl: 'BUS·0.99', emoji: '🚌' }, { id: 2, y: 58, w: 44, h: 19, color: '#65FF12', lbl: 'SEDAN·0.97', emoji: '🚗' }, { id: 3, y: 78, w: 40, h: 21, color: '#f5a623', lbl: 'TRUCK·0.91', emoji: '🚛' }].map((v) => (
              <React.Fragment key={v.id}>
                <div id={`car${v.id}`} style={{ position: 'absolute', top: `${v.y}%`, width: `${v.w}px`, height: `${v.h}px`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', background: 'rgba(101,255,18,0.06)', borderRadius: '3px' }}>{v.emoji}</div>
                <div id={`bbox${v.id}`} style={{ position: 'absolute', top: `calc(${v.y}% - 2px)`, width: `${v.w + 4}px`, height: `${v.h + 4}px`, border: `1px solid ${v.color}`, borderRadius: '3px', pointerEvents: 'none' }}></div>
                <div id={`lbl${v.id}`} style={{ position: 'absolute', top: `calc(${v.y}% - 19px)`, background: v.color, color: '#050505', fontFamily: 'var(--font-mono)', fontSize: '8px', padding: '2px 4px', borderRadius: '2px', whiteSpace: 'nowrap' }}>{v.lbl}</div>
              </React.Fragment>
            ))}
            <div className="hud">
              <div className="hud-row"><span className="hud-label">VEHICLES</span><span className="hud-val" id="vehCount">24</span></div>
              <div className="hud-row"><span className="hud-label">AVG SPD</span><span className="hud-val">47 KPH</span></div>
              <div className="hud-row"><span className="hud-label">DENSITY</span><span className="hud-val">MED</span></div>
              <div className="hud-row"><span className="hud-label">LATENCY</span><span className="hud-val" id="latency">12ms</span></div>
              <div className="hud-bar"><div className="hud-fill"></div></div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className="trust">
        <div className="trust-inner">
          <div className="trust-item"><span className="trust-icon">◆</span>GOVERNMENT-READY</div>
          <div className="trust-item"><span className="trust-icon">◆</span>99.97% UPTIME SLA</div>
          <div className="trust-item"><span className="trust-icon">◆</span>SUB-20MS LATENCY</div>
          <div className="trust-item"><span className="trust-icon">◆</span>ISO 27001 COMPLIANT</div>
          <div className="trust-item"><span className="trust-icon">◆</span>EDGE-DEPLOYABLE</div>
          <div className="trust-item"><span className="trust-icon">◆</span>50+ VEHICLE CLASSES</div>
        </div>
      </div>

      {/* ABOUT */}
      <section id="about" style={{ background: 'var(--bg2)' }}>
        <div className="fade-up">
          <div className="section-label">// WHO WE ARE</div>
          <h2 className="section-title">Built by Engineers,<br />for Smart Cities</h2>
        </div>
        <div className="about-grid fade-up">
          <div className="about-text">
            <p>TrafficGAN is an intelligent traffic data collection startup. leveraging advanced computer vision and AI technologies, TrafficGAN automatically detects, classifies, counts, and tracks road users, providing accurate traffic flow, speed, density, directional counting, and mobility data to support smarter transportation planning and operations.</p>
            <p>Our mission is to make high-quality traffic data accessible, affordable, and scalable for transportation agencies, researchers, consultants, and smart cities. TrafficGAN aims to replace costly and time-consuming manual surveys with automated, reliable, and data-driven solutions that support safer roads, more efficient transportation networks, and smarter urban planning.</p>
            <p>Traffic data collection has traditionally required expensive equipment, specialized software, extensive fieldwork, and large teams of surveyors. TrafficGAN changes this process by making traffic analysis available to everyone through a simple and intuitive platform.</p>
            <p><strong>With TrafficGAN, users can:</strong></p>
          </div>
          <div>
            <div className="about-stat-grid">
              <div className="about-stat"><div className="about-stat-num">50+</div><div className="about-stat-label">VEHICLE CLASSES</div></div>
              <div className="about-stat"><div className="about-stat-num">99.4%</div><div className="about-stat-label">DETECTION ACCURACY</div></div>
              <div className="about-stat"><div className="about-stat-num">&lt;20ms</div><div className="about-stat-label">INFERENCE LATENCY</div></div>
              <div className="about-stat"><div className="about-stat-num">0</div><div className="about-stat-label">NEW HARDWARE NEEDED</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES CASCADE */}
      <section id="services" style={{ background: 'var(--bg2)' }}>
        <div className="fade-up">
          <div className="section-label">// OUR SERVICES</div>
          <h2 className="section-title">Full-Spectrum Traffic Intelligence</h2>
          <p className="section-sub">Click any category to explore our AI-powered services — each deployable independently or as a unified platform.</p>
        </div>
        <div className="services-layout fade-up">
          <div className="services-menu">
            {SERVICES_DATA.map((cat, ci) => (
              <div key={ci} className="svc-category">
                <button
                  className={`svc-cat-btn ${activeCat === ci ? 'active' : ''}`}
                  onClick={() => setActiveCat(activeCat === ci ? -1 : ci)}
                >
                  <span><span className="svc-cat-icon">{cat.icon}</span>{cat.cat}</span>
                  <span className="svc-chevron">›</span>
                </button>
                <div className={`svc-items ${activeCat === ci ? 'open' : ''}`}>
                  {cat.items.map(item => (
                    <div
                      key={item.id}
                      className={`svc-item ${activeItem?.id === item.id ? 'selected' : ''}`}
                      onClick={() => setActiveItem(item)}
                    >
                      <span className="svc-item-name">{item.name}</span>
                      <span className="svc-item-arrow">›</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="svc-detail">
            {activeItem ? (
              <div className="svc-detail-content" key={activeItem.id}>
                <span className="svc-tag">{activeItem.tag}</span>
                <div className="svc-detail-title">{activeItem.name}</div>
                <div className="svc-detail-desc">{activeItem.desc}</div>
                <div className="svc-metrics">
                  {activeItem.metrics.map((m, i) => (
                    <div key={i} className="svc-metric">
                      <div className="svc-metric-val">{m.v}</div>
                      <div className="svc-metric-label">{m.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="svc-detail-placeholder">
                <div className="big-icon">📡</div>
                <p>← SELECT A SERVICE TO EXPLORE</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how">
        <div className="fade-up">
          <div className="section-label">// HOW IT WORKS</div>
          <h2 className="section-title">Four Steps to Intelligence</h2>
          <p className="section-sub">From raw camera feed to actionable traffic insight in milliseconds.</p>
        </div>
        <div className="steps fade-up">
          <div className="step"><div className="step-num">01</div><div className="step-title">Capture</div><div className="step-desc">Connect to existing RTSP/IP camera network. No hardware swap required.</div></div>
          <div className="step"><div className="step-num">02</div><div className="step-title">Analyze</div><div className="step-desc">Our AI engine runs detection and tracking on each frame in real time.</div></div>
          <div className="step"><div className="step-num">03</div><div className="step-title">Process</div><div className="step-desc">Data is structured, classified, and pushed to scalable cloud or edge pipeline.</div></div>
          <div className="step"><div className="step-num">04</div><div className="step-title">Visualize</div><div className="step-desc">Live dashboards, alerts, and API access for your traffic management systems.</div></div>
        </div>
      </section>

      {/* TECHNOLOGY */}
      <section id="technology" style={{ background: 'var(--bg2)' }}>
        <div className="fade-up">
          <div className="section-label">// ARCHITECTURE</div>
          <h2 className="section-title">Enterprise-Grade Infrastructure</h2>
          <p className="section-sub">Built for scale, redundancy, and security — deployable on-premise, edge, or cloud.</p>
        </div>
        <div className="arch fade-up">
          <div className="arch-flow">
            <div className="arch-node"><div className="arch-node-icon">📷</div><div className="arch-node-label">Camera Network</div><div className="arch-node-sub">RTSP / ONVIF</div></div>
            <div className="arch-arrow"></div>
            <div className="arch-node"><div className="arch-node-icon">🤖</div><div className="arch-node-label">AI Engine</div><div className="arch-node-sub">YOLOv9 + DeepSORT</div></div>
            <div className="arch-arrow"></div>
            <div className="arch-node"><div className="arch-node-icon">🏷️</div><div className="arch-node-label">Classification</div><div className="arch-node-sub">50+ Classes</div></div>
            <div className="arch-arrow"></div>
            <div className="arch-node"><div className="arch-node-icon">🗄️</div><div className="arch-node-label">Analytics DB</div><div className="arch-node-sub">TimeSeries / SQL</div></div>
            <div className="arch-arrow"></div>
            <div className="arch-node"><div className="arch-node-icon">📡</div><div className="arch-node-label">Dashboard</div><div className="arch-node-sub">REST / WebSocket</div></div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section>
        <div className="fade-up">
          <div className="section-label">// BENEFITS</div>
          <h2 className="section-title">Why Cities Choose TrafficGAN</h2>
        </div>
        <div className="cards-grid fade-up" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <div className="card"><div className="card-icon">🚦</div><div className="card-title">Reduce Congestion</div><div className="card-desc">Dynamic signal control powered by real-time density data.</div></div>
          <div className="card"><div className="card-icon">💰</div><div className="card-title">Lower Costs</div><div className="card-desc">Eliminate sensor maintenance. Zero new hardware. Pay per analytics seat.</div></div>
          <div className="card"><div className="card-icon">🗺️</div><div className="card-title">Better Planning</div><div className="card-desc">Month-over-month mobility trend analysis for infrastructure teams.</div></div>
          <div className="card"><div className="card-icon">⚡</div><div className="card-title">Faster Decisions</div><div className="card-desc">Incident detection and alert notifications under 3 seconds.</div></div>
          <div className="card"><div className="card-icon">🌐</div><div className="card-title">Scalable Deployment</div><div className="card-desc">From 10 cameras to 10,000 — horizontal scaling, zero downtime.</div></div>
          <div className="card"><div className="card-icon">📈</div><div className="card-title">Data-Driven Ops</div><div className="card-desc">Open API and BI integrations for existing city operation platforms.</div></div>
        </div>
      </section>

      {/* DASHBOARD */}
      <section style={{ background: 'var(--bg2)' }}>
        <div className="fade-up">
          <div className="section-label">// PLATFORM</div>
          <h2 className="section-title">Command Center Dashboard</h2>
          <p className="section-sub">One unified view across your entire city camera network — live.</p>
        </div>
        <div className="dashboard fade-up">
          <div className="dash-header">
            <span className="dash-title-text">TRAFFICGAN ANALYTICS — CITY CENTRAL — ALL ZONES</span>
          </div>
          <div className="dash-body">
            <div className="dash-panel">
              <div className="dash-metric-label">VEHICLES TODAY</div>
              <div className="dash-metric-val">284,917</div>
              <div className="dash-metric-change">↑ 3.2% vs yesterday</div>
              <div className="mini-chart">
                <div className="mini-bar" style={{ height: '40%' }}></div>
                <div className="mini-bar" style={{ height: '55%' }}></div>
                <div className="mini-bar" style={{ height: '70%' }}></div>
                <div className="mini-bar" style={{ height: '45%' }}></div>
                <div className="mini-bar" style={{ height: '80%' }}></div>
                <div className="mini-bar active" style={{ height: '90%' }}></div>
                <div className="mini-bar partial" style={{ height: '60%' }}></div>
              </div>
            </div>
            <div className="dash-panel">
              <div className="dash-metric-label">AVG JOURNEY TIME</div>
              <div className="dash-metric-val">18.4 MIN</div>
              <div className="dash-metric-change">↓ 1.7min vs last week</div>
              <div className="dash-metric-label" style={{ marginTop: '16px' }}>VEHICLE MIX</div>
              <div className="pie-ring"></div>
            </div>
            <div className="dash-panel">
              <div className="dash-metric-label">INCIDENTS DETECTED</div>
              <div className="dash-metric-val">3</div>
              <div className="dash-metric-change" style={{ color: '#ff6b35' }}>⚠ 2 active alerts</div>
              <div className="dash-metric-label" style={{ marginTop: '14px' }}>CONGESTION SCORE</div>
              <div style={{ height: '7px', background: '#1a1a1a', borderRadius: '4px', marginTop: '6px', overflow: 'hidden' }}><div style={{ width: '38%', height: '100%', background: 'var(--neon)', borderRadius: '4px' }}></div></div>
              <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>LOW — 38/100</div>
            </div>
          </div>
          <div className="live-feed">
            <div className="feed-title">RECENT DETECTIONS — ZONE A</div>
            <div className="feed-row"><div className="feed-dot" style={{ background: 'var(--neon)' }}></div><span className="feed-cam">CAM_14</span><span className="feed-type" style={{ background: 'rgba(101,255,18,0.1)', color: 'var(--neon)' }}>SEDAN</span><span style={{ fontSize: '10px', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>N→S 52kph</span><span className="feed-count">0.3s ago</span></div>
            <div className="feed-row"><div className="feed-dot" style={{ background: 'var(--neon2)' }}></div><span className="feed-cam">CAM_07</span><span className="feed-type" style={{ background: 'rgba(38,216,39,0.1)', color: 'var(--neon2)' }}>BUS</span><span style={{ fontSize: '10px', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>E→W 28kph</span><span className="feed-count">1.1s ago</span></div>
            <div className="feed-row"><div className="feed-dot" style={{ background: '#f5a623' }}></div><span className="feed-cam">CAM_22</span><span className="feed-type" style={{ background: 'rgba(245,166,35,0.1)', color: '#f5a623' }}>TRUCK</span><span style={{ fontSize: '10px', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>S→N 41kph</span><span className="feed-count">2.4s ago</span></div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" id="contact">
        <div className="fade-up">
          <div className="section-label" style={{ color: 'var(--neon)' }}>// GET STARTED</div>
          <h2>READY TO SEE YOUR<br /><span>ROADS CLEARLY?</span></h2>
          <p className="cta-sub">Join forward-thinking cities using TrafficGAN to build smarter, safer streets.</p>
          <button className="btn-glow" onClick={() => setIsModalOpen(true)}>Request Your Demo →</button>
        </div>
      </section>

      <footer>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="logo-container">
            {/* REPLACE THIS SVG WITH YOUR ACTUAL SVG LOGO */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="500"
              height="500"
              version="1"
              viewBox="0 0 375 375"
            >
              <defs>
                <clipPath id="92cbf065f0">
                  <path d="M164 136h125.648v115H164Zm0 0"></path>
                </clipPath>
                <clipPath id="36631299b3">
                  <path d="M78.898 156H228v95H78.898Zm0 0"></path>
                </clipPath>
                <clipPath id="edd77bf881">
                  <path d="M44.273 9.492H212v67.5H44.273Zm0 0"></path>
                </clipPath>
                <clipPath id="d6ae59394f">
                  <path d="M94 .492h73.98v67.5H94Zm0 0"></path>
                </clipPath>
                <clipPath id="0c59f705d6">
                  <path d="M48 .492h74v67.5H48Zm0 0"></path>
                </clipPath>
                <clipPath id="3e8fcf055c">
                  <path d="M2 .492h74v67.5H2Zm0 0"></path>
                </clipPath>
                <clipPath id="8e1bffc1d8">
                  <path d="M.273.492H30v67.5H.273Zm0 0"></path>
                </clipPath>
                <clipPath id="9dd94fd8b3">
                  <path d="M0 0h168v68H0z"></path>
                </clipPath>
                <clipPath id="a18b31a99f">
                  <path d="M0 0h212v86H0z"></path>
                </clipPath>
                <clipPath id="f6ca2bcccd">
                  <path d="M116 194.816h31v34.5h-31Zm0 0"></path>
                </clipPath>
                <clipPath id="e69d17cab7">
                  <path d="M168.906 106h30.75v27h-30.75Zm0 0"></path>
                </clipPath>
                <clipPath id="567c80bf06">
                  <path d="M169 160.086h31v33h-31Zm0 0"></path>
                </clipPath>
                <clipPath id="77e254338b">
                  <path d="M219.727 193.316h37.5v36h-37.5Zm0 0"></path>
                </clipPath>
                <filter id="380aa8d694" width="100%" height="100%" x="0%" y="0%">
                  <feColorMatrix
                    colorInterpolationFilters="sRGB"
                    values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
                  ></feColorMatrix>
                </filter>
                <mask id="dce176e0a8">
                  <g filter="url(#380aa8d694)">
                    <path fillOpacity="0.9" d="M-37.5-37.5h450v450h-450z"></path>
                  </g>
                </mask>
              </defs>
              <g clipPath="url(#92cbf065f0)">
                <path d="M196.785 241.273c4.88-4.222 9.383-8.168 13.969-12.023.426-.355 1.422-.324 2.043-.121 10.633 3.43 21.566 4.992 32.656 4.008 7.008-.625 13.95-2.219 20.844-3.727 3.441-.754 5.043-4.023 4.207-7.515-3.727-15.583-10.938-29.305-21.977-40.977-13.488-14.262-29.98-22.961-49.207-26.477-10.746-1.964-21.52-1.761-32.246.348-.726.14-1.46.246-2.851.48-.024-5.59-.086-10.878.011-16.167.008-.461 1.059-1.188 1.711-1.301 14.594-2.492 29.114-2.168 43.496 1.476 25.875 6.559 46.5 20.809 61.696 42.727 10.539 15.203 16.605 32.117 18.074 50.61.437 5.519.418 5.616-4.652 7.913-24.82 11.25-50.274 13.012-76.325 4.852-3.816-1.195-7.535-2.691-11.449-4.106m0 0"></path>
              </g>
              <path d="M233.203 134.18c-5.73-1.989-11.414-3.895-17.027-5.996-.668-.25-1.188-1.485-1.375-2.348q-4.184-19.314-16.301-34.895c-3.027-3.89-6.504-7.453-9.957-10.992-2.34-2.398-6.027-2.344-8.484-.07a87.3 87.3 0 0 0-11.786 13.336 87.5 87.5 0 0 0-8.847 15.441c-6.653 14.856-9.16 30.453-7.184 46.617 2.192 17.918 9.117 33.86 20.961 47.579.5.578 1.004 1.144 1.492 1.73.09.11.114.273.414 1.02-4.539 2.656-9.144 5.394-13.82 8.007-.351.196-1.375-.308-1.762-.761q-14.026-16.506-20.265-37.266c-4.942-16.398-6.028-33.074-2.79-49.934 4.489-23.355 15.47-43.152 33.15-59.082 4.167-3.757 8.87-6.925 13.417-10.238.563-.41 1.902-.387 2.516.008q24.17 15.568 37.101 41.285c5.703 11.281 9.09 23.207 10.594 35.715.035.285-.031.586-.047.844m0 0"></path>
              <g clipPath="url(#36631299b3)">
                <path d="M122.637 156.086c.84 4.637 1.261 9.059 2.496 13.242 1.183 4.012.262 6.469-2.809 9.395-12.328 11.75-20.144 26.226-24.195 42.754-.977 3.976.691 6.98 4.598 8.117 18.136 5.285 36.246 5.308 54.125-.969 27.308-9.59 45.722-28.238 55.48-55.477.203-.566.422-1.125.844-2.25 4.133 2.243 8.152 4.313 12.058 6.575 2.993 1.73 2.97 1.851 1.707 5.054-10.558 26.762-28.726 46.582-54.96 58.328-30.676 13.735-61.34 12.735-91.555-2.027-1.281-.625-1.528-1.371-1.442-2.648Q82 191.444 115.52 161.715c2.207-1.953 4.625-3.664 7.117-5.63m0 0"></path>
              </g>
              <g mask="url(#dce176e0a8)">
                <g clipPath="url(#a18b31a99f)" transform="translate(58 250)">
                  <g clipPath="url(#edd77bf881)">
                    <g clipPath="url(#9dd94fd8b3)" transform="translate(44 9)">
                      <g clipPath="url(#d6ae59394f)">
                        <path
                          fill="#65ff12"
                          d="M167.93 33.82 94.21-8.762v22.5l34.743 20.082-34.742 20.04v22.538Zm0 0"
                        ></path>
                      </g>
                      <g clipPath="url(#0c59f705d6)">
                        <path
                          fill="#26d827"
                          d="M121.875 33.82 48.156-8.762v22.5L82.898 33.82 48.156 53.86v22.538Zm0 0"
                        ></path>
                      </g>
                      <g clipPath="url(#3e8fcf055c)">
                        <path
                          fill="#139618"
                          d="M75.863 33.82 2.102-8.762v22.5L36.887 33.82 2.102 53.86v22.538Zm0 0"
                        ></path>
                      </g>
                      <g clipPath="url(#8e1bffc1d8)">
                        <path
                          fill="#0e4d11"
                          d="m29.809 33.82-73.72-42.582v22.5L-9.167 33.82-43.91 53.86v22.538Zm0 0"
                        ></path>
                      </g>
                    </g>
                  </g>
                </g>
              </g>
              <g clipPath="url(#f6ca2bcccd)">
                <path d="M131.45 194.816c-5.235 0-9.65.29-10.305.672-1.153.395-2.016 3.008-2.02 6.106v1.539h-.312a.9.9 0 0 0-.13-.196.84.84 0 0 0 .212-.562v-.782c.003-.023.003-.042.003-.07 0-.359-.27-.656-.617-.699h-1.234a.71.71 0 0 0-.613.774v.78a.86.86 0 0 0 .21.567l-.003-.004a.87.87 0 0 0-.211.563v3.933c0 .36.27.657.617.7h1.234a.6.6 0 0 0 .528-.383l.004-.004h.312v6.934c0 .273.297.527.77.664v.898c-.68.09-1.149.395-1.149.746v7.703a3 3 0 0 0-.008.211c0 .918.293 1.77.785 2.469l-.007-.012v1.325c0 .347.285.632.632.632h2.586a.635.635 0 0 0 .633-.632v-.91h16.168v.91c0 .347.281.632.63.632h2.585a.633.633 0 0 0 .633-.632v-1.325a4.24 4.24 0 0 0 .77-2.672v.008-7.703c0-.351-.473-.656-1.15-.746v-.898c.477-.137.77-.391.77-.668v-6.926h.313a.6.6 0 0 0 .531.383h1.23a.7.7 0 0 0 .618-.7q.001-.04-.004-.074v.004-3.863a.86.86 0 0 0-.207-.563.87.87 0 0 0 .21-.562v-.848c0-.36-.265-.66-.612-.703h-1.239a.71.71 0 0 0-.613.777v-.004.782a.86.86 0 0 0 .21.566l-.003-.004a1 1 0 0 0-.125.192v.004h-.312v-1.547c0-3.118-.875-5.739-2.036-6.114-.703-.382-5.093-.664-10.285-.664Zm-10.563 4.47h21.12c.376 0 .684.26.755.612l.004.008c.144.73.23 1.574.23 2.438v5.41c0 .426-.348.77-.773.77h-21.555a.77.77 0 0 1-.773-.77v-5.406c0-.864.085-1.707.246-2.524l-.016.082a.77.77 0 0 1 .758-.62Zm.933 16.94h1.653c.203 0 .37.16.382.364l.274 5.008v.02c0 .21-.172.382-.387.382h-1.922a.387.387 0 0 1-.386-.383v-5.008c0-.21.175-.382.386-.382m17.602 0h1.652c.211 0 .383.172.383.383v5.004c0 .211-.172.383-.383.383h-1.926a.384.384 0 0 1-.386-.383v-.023.004l.277-5.008c.012-.2.18-.36.383-.36m-14.328.919H137.8c.105 0 .191.085.191.195v.23a.19.19 0 0 1-.191.192h-12.707a.19.19 0 0 1-.192-.192v-.23c0-.11.086-.195.192-.195m.078 1.386h12.55c.106 0 .196.086.196.192v.23c0 .11-.09.195-.195.195h-12.551a.193.193 0 0 1-.195-.195v-.23c0-.106.085-.192.195-.192m.074 1.387h12.402c.106 0 .192.086.192.191v.23a.19.19 0 0 1-.192.192h-12.402a.196.196 0 0 1-.191-.183v-.23c0-.106.09-.192.195-.192Zm.078 1.387h12.246c.106 0 .192.086.192.191v.23a.19.19 0 0 1-.192.192h-12.246a.19.19 0 0 1-.191-.191v-.23c0-.106.086-.192.191-.192m0 0"></path>
              </g>
              <g clipPath="url(#e69d17cab7)">
                <path
                  fillRule="evenodd"
                  d="M198.422 116.75v15.32h-3.578v-2.367h-21.121v2.367h-3.582v-15.32h-1.235v-2.355h3.012l1.68-5.223c.496-1.543 1.324-2.942 2.937-2.942h16.113c1.618 0 2.551 1.372 2.942 2.938l1.297 5.227h2.77v2.351h-1.235Zm-19.504 8.227h10.578v2.492h-10.578Zm-7.578-5.813c2.695.086 4.344 1.215 4.765 3.57h-4.765Zm25.543 0c-2.696.086-4.344 1.215-4.766 3.57h4.766Zm-23.676-4.77h22.152l-.949-4.382c-.262-1.203-1.008-2.242-2.242-2.242h-15.316c-1.235 0-1.864 1.066-2.243 2.242Zm0 0"
                ></path>
              </g>
              <g clipPath="url(#567c80bf06)">
                <path d="M198.426 172.672c-.43-.668-.668-2.113-.617-2.996.125-2.055-.965-4.098-2.657-4.965-.324-.168-.617-.25-.875-.324-.445-.13-.629-.184-.797-.532-.71-1.48-1.5-2.003-3.003-2.003-.22 0-.457.007-.73.027-.157 0-.4-.262-.634-.512-.414-.441-.96-1.027-1.832-1.129l-.281-.027c-.934 0-1.836.277-2.477.762-.148.113-.324.21-.558.004-.488-.43-1.278-.891-2.012-.891q-.383 0-.683.164c-.864.172-1.418.719-1.829 1.125-.27.27-.504.5-.707.5q-.39-.023-.722-.023c-1.504 0-2.29.523-3 2.003-.024.047-.051.079-.075.114h.43a2.78 2.78 0 0 1 2.778 2.773.554.554 0 1 1-1.11 0c0-.918-.75-1.664-1.668-1.664h-2.617c-1.348.996-2.18 2.793-2.07 4.598.054.883-.184 2.328-.614 2.996-1.058 1.644-1.058 3.945 0 5.594.164.254.403.547.68.89.266.328.621.77.895 1.188l1.054-1.5c.79-1.313 2.211-2.114 3.782-2.114a3.337 3.337 0 0 0 3.332-3.328.555.555 0 1 1 1.109 0 4.445 4.445 0 0 1-4.441 4.438 3.31 3.31 0 0 0-2.852 1.61l-1.59 2.257c.063 1.957 1.266 4.074 2.824 4.875.305.156.356.313.47.79.01.05.026.108.038.163v-.265a3.89 3.89 0 0 1 3.883-3.883c.309 0 .555.246.555.554a.55.55 0 0 1-.555.555 2.78 2.78 0 0 0-2.773 2.774v2.042c.296.208.601.325.859.422.52.196.734.278.812.848.215 1.566 1.145 2.504 2.485 2.504 1.191 0 2.48-.805 3.285-2.055a.38.38 0 0 1 .328-.168c.063 0 .227.016.324.168.805 1.25 2.094 2.055 3.29 2.055 1.03 0 2.226-.656 2.484-2.504.078-.57.293-.652.812-.848.524-.199 1.239-.472 1.696-1.422.168-.351.246-.68.312-.94.113-.477.164-.634.465-.79 1.68-.863 2.945-3.25 2.82-5.324-.027-.465.801-1.488 1.297-2.102.277-.34.516-.636.68-.89 1.058-1.649 1.058-3.95 0-5.594m-16.848 9.68a.559.559 0 0 1-.394.949.54.54 0 0 1-.391-.164 3.73 3.73 0 0 1-1.102-2.657c0-1 .391-1.94 1.102-2.652a.55.55 0 0 1 .785 0 .56.56 0 0 1 0 .785c-.5.5-.777 1.164-.777 1.867 0 .708.277 1.372.777 1.872m.004-13.903a2.645 2.645 0 0 0-3.062 2.145 3.764 3.764 0 0 1-4.348 3.05.56.56 0 0 1-.453-.644c.054-.3.34-.5.644-.45a2.65 2.65 0 0 0 3.063-2.148 3.76 3.76 0 0 1 4.347-3.047c.301.051.504.34.45.641-.051.3-.34.5-.641.453m14.867-.883a.554.554 0 1 1 0 1.11.554.554 0 0 1 0-1.11m-9.984 13.313a.554.554 0 1 1 0-1.109.554.554 0 0 1 0 1.109m.555 3.887c0 .304-.25.554-.555.554a.554.554 0 1 1 .555-.555m6.101-8.325a.554.554 0 1 1 0-1.108.554.554 0 0 1 0 1.108m.555 1.664a.554.554 0 1 1-1.11 0 .554.554 0 0 1 1.11 0m-.555-3.882a.554.554 0 1 1 0-1.109.554.554 0 0 1 0 1.109m-1.11-1.11a.557.557 0 0 1-.554-.554.554.554 0 1 1 .555.555m1.11-1.11a.557.557 0 0 1-.555-.554.554.554 0 1 1 .555.555m-1.11-4.437a.554.554 0 1 1 0 1.11.554.554 0 0 1 0-1.11m-.554-1.664a.554.554 0 1 1 1.109 0 .554.554 0 0 1-1.109 0m-.555 1.664a.554.554 0 1 1 0-1.11.554.554 0 0 1 0 1.11m0 3.329a.554.554 0 1 1 .001 1.108.554.554 0 0 1 0-1.108m-2.218 1.109a.557.557 0 0 1-.555-.555c0-.304.25-.554.555-.554a.554.554 0 1 1 0 1.11m1.109 2.219a.554.554 0 1 1 0 1.108.554.554 0 0 1 0-1.108m-1.11 1.109a.554.554 0 1 1 0 1.11.554.554 0 0 1 0-1.11m-1.109-1.11a.554.554 0 1 1 0 1.11.554.554 0 0 1 0-1.11m-.554-1.663c0-.305.25-.555.554-.555s.555.25.555.555c0 .304-.25.554-.555.554a.557.557 0 0 1-.554-.554m.554 3.882a.554.554 0 1 1 0 1.11.554.554 0 0 1 0-1.11m1.11 3.329a.554.554 0 1 1 0 0m1.109-2.22a.554.554 0 1 1 0-1.108.554.554 0 0 1 0 1.109m.555 6.106a.554.554 0 1 1-1.109.001.554.554 0 0 1 1.109 0m.554-6.105a.554.554 0 1 1 .001 1.108.554.554 0 0 1 0-1.108m-1.109-8.875a.554.554 0 1 1 0-1.11.554.554 0 0 1 0 1.11m-1.11-2.219a.554.554 0 1 1 .001 1.109.554.554 0 0 1 0-1.109m-.554-1.664a.554.554 0 1 1 1.109 0 .554.554 0 0 1-1.11 0m.555 3.883c.304 0 .554.25.554.554s-.25.555-.554.555a.554.554 0 1 1 0-1.11m-1.11 0a.554.554 0 1 1 0-1.11.554.554 0 0 1 0 1.11m-1.11-1.11a.554.554 0 1 1 0-1.11.554.554 0 0 1 0 1.11m0 1.11c.306 0 .556.25.556.554s-.25.555-.555.555a.554.554 0 1 1 0-1.11m0 2.219c.306 0 .556.25.556.554s-.25.555-.555.555a.554.554 0 1 1 0-1.11m0 2.218a.554.554 0 1 1-.555.555c.001-.305.251-.555.556-.555m0 4.438a.554.554 0 1 1-.555.555c.001-.305.251-.555.556-.555m1.11 5.55a.554.554 0 1 1 .001 1.11.554.554 0 0 1 0-1.11m1.11 0a.554.554 0 1 1 0-1.11.554.554 0 0 1 0 1.11m.554 6.102c0 .305-.25.555-.554.555a.554.554 0 1 1 .555-.555m.555-2.773a.554.554 0 1 1 0-1.11.554.554 0 0 1 0 1.11m.555 1.664a.554.554 0 1 1-1.109 0 .554.554 0 0 1 1.109 0m.554-1.664a.554.554 0 1 1 0 1.11.554.554 0 0 1 0-1.11m0-5.551a.554.554 0 1 1 0-1.109.554.554 0 0 1 0 1.109m1.11 2.223a.554.554 0 1 1 0 0m0-7.77a.554.554 0 1 1-.001-1.109.554.554 0 0 1 0 1.109m1.11 5.547a.554.554 0 1 1-.002-1.109.554.554 0 0 1 .001 1.109m.554 1.668a.554.554 0 1 1-1.109 0 .554.554 0 0 1 1.109 0m.554-1.668c.31 0 .555.25.555.555a.555.555 0 1 1-1.11 0c0-.305.25-.555.555-.555m0-7.766a.557.557 0 0 1-.554-.554.554.554 0 1 1 .555.555m0-3.328a.554.554 0 1 1 .001 1.109.554.554 0 0 1 0-1.109m-.554-1.664a.554.554 0 1 1 1.108 0 .554.554 0 0 1-1.108 0m1.664 8.32a.554.554 0 1 1 0-1.108.554.554 0 0 1 0 1.108m.555 1.664a.554.554 0 1 1-1.11 0 .554.554 0 0 1 1.11 0m-.555-8.32a.557.557 0 0 1-.555-.555.554.554 0 1 1 .555.555m1.11 3.328a.557.557 0 0 1-.555-.554.554.554 0 1 1 .555.555m.554 1.664a.554.554 0 1 1-1.11 0 .554.554 0 0 1 1.11 0m-.555-3.882a.557.557 0 0 1-.554-.555.554.554 0 1 1 .555.555m-1.11-4.438a.554.554 0 1 1-.555.555c.001-.309.251-.555.556-.555m-1.109-1.11a.554.554 0 1 1 0 1.11.554.554 0 0 1 0-1.11m-1.109-1.109a.554.554 0 1 1 0 1.11.554.554 0 0 1 0-1.11m-1.11-1.11c.31 0 .555.247.555.556a.554.554 0 1 1-.554-.555m-1.109-1.108a.554.554 0 1 1 0 1.11.554.554 0 0 1 0-1.11m-1.109 1.109a.554.554 0 1 1 0 1.11.554.554 0 0 1 0-1.11m-1.11-1.11a.554.554 0 1 1 .001 1.11.554.554 0 0 1 0-1.11m-1.109-1.109a.554.554 0 1 1 .001 1.109.554.554 0 0 1 0-1.109m-1.11 1.11a.554.554 0 1 1 .002 1.108.554.554 0 0 1-.001-1.108m-1.109-1.11a.554.554 0 1 1 .001 1.109.554.554 0 0 1 0-1.109m0 2.219a.554.554 0 1 1 .001 1.109.554.554 0 0 1 0-1.11m0 2.219a.554.554 0 1 1 .001 1.108.554.554 0 0 1 0-1.108m0 4.437c.305 0 .555.25.555.555s-.25.555-.555.555a.554.554 0 1 1 0-1.11m0 4.438a.554.554 0 1 1 0 1.11.554.554 0 0 1 0-1.11m0 2.218a.554.554 0 1 1 0 1.11.554.554 0 0 1 0-1.11m0 2.22a.554.554 0 1 1 0 1.11.554.554 0 0 1 0-1.11m0 2.218a.557.557 0 0 1 0 1.113.558.558 0 0 1 0-1.113m0 2.223a.554.554 0 1 1 .001 1.108.554.554 0 0 1 0-1.108m0 2.218a.554.554 0 1 1 .001 1.109.554.554 0 0 1 0-1.109m0 2.22a.554.554 0 1 1 .001 1.108.554.554 0 0 1 0-1.109m0 3.327a.554.554 0 1 1 0-1.11.554.554 0 0 1 0 1.11m1.11 1.11a.557.557 0 0 1-.555-.555c0-.305.25-.555.555-.555s.555.25.555.555-.25.555-.555.555m0-2.22a.554.554 0 1 1 0-1.11.554.554 0 0 1 0 1.11m1.11-1.109a.554.554 0 1 1 0-1.11.554.554 0 0 1 0 1.11m1.109 3.329a.557.557 0 0 1-.555-.555c0-.305.25-.555.555-.555a.554.554 0 1 1 0 1.11m1.109-1.11a.554.554 0 1 1 0-1.11.554.554 0 0 1 0 1.11m1.11-1.11a.554.554 0 1 1 0-1.11.554.554 0 0 1 0 1.11m1.109-1.109a.554.554 0 1 1 0-1.11.554.554 0 0 1 0 1.11m0-2.218a.554.554 0 1 1 0-1.11.554.554 0 0 1 0 1.11m1.11-1.11a.554.554 0 1 1 0-1.11.554.554 0 0 1 0 1.11m1.108-1.11a.554.554 0 1 1 0-1.11.554.554 0 0 1 0 1.11m1.11-1.108a.554.554 0 1 1 0-1.11.554.554 0 0 1 0 1.11m0-2.223a.554.554 0 1 1 0-1.109.554.554 0 0 1 0 1.109m1.11-1.11a.554.554 0 1 1-.002-1.108.554.554 0 0 1 .001 1.109m1.109-1.109a.554.554 0 1 1 0-1.11.555.555 0 1 1 0 1.11m0-2.219a.554.554 0 1 1 0-1.109.555.555 0 1 1 0 1.11m0-2.218a.554.554 0 1 1 0-1.11.555.555 0 1 1 0 1.11m0 0"></path>
              </g>
              <g clipPath="url(#77e254338b)">
                <path
                  fill="#100f0d"
                  d="M251.332 214.07c0 .672-.426 1.27-1.059 1.485-3.02 1.007-7.191 1.632-11.796 1.632-4.61 0-8.782-.625-11.801-1.632a1.57 1.57 0 0 1-1.059-1.485v-12.98c0-.785.633-1.426 1.414-1.426h22.887c.781 0 1.414.64 1.414 1.426Zm0 6.254c0 1.586-1.488 2.875-3.324 2.875h-4.149c-.968 0-1.28-1.129-.414-1.504l6.602-2.863c.59-.258 1.285.113 1.285.688ZM233.09 223.2h-4.149c-1.836 0-3.324-1.289-3.324-2.875v-.804c0-.575.696-.946 1.285-.688l6.602 2.863c.867.375.555 1.504-.414 1.504m-1.422-27.453a.42.42 0 0 1 .422-.422h12.773a.42.42 0 0 1 .418.422v2.05a.42.42 0 0 1-.418.423H232.09a.42.42 0 0 1-.422-.422Zm24.887 6.816h-.395v-.359c0-.668-.543-1.215-1.207-1.215h-1.492v-3.48c0-.457-.098-.89-.274-1.281-.41-.918-1.269-1.54-2.246-1.735l-.543-.105c-5.757-1.067-11.921-.84-11.921-.84s-6.165-.227-11.926.84l-.543.105c-.973.196-1.836.817-2.246 1.735-.172.39-.274.824-.274 1.28v3.481h-1.492c-.664 0-1.207.547-1.207 1.215v.36h-.394a.664.664 0 0 0-.665.667v5.223c0 .367.297.668.665.668h1.699c.367 0 .664-.3.664-.668v-5.223a.664.664 0 0 0-.664-.667h-.395v-.36a.3.3 0 0 1 .297-.3h1.492v20.23c0 1.637.965 3.043 2.352 3.676v2.71c0 .442.355.801.793.801h4.125c.437 0 .789-.36.789-.8v-2.348h13.855v2.348c0 .44.356.8.793.8h4.125c.438 0 .793-.36.793-.8v-2.711a4.04 4.04 0 0 0 2.348-3.676v-20.23h1.492c.164 0 .3.136.3.3v.36h-.398a.664.664 0 0 0-.66.667v5.223c0 .367.297.668.66.668h1.7c.367 0 .664-.3.664-.668v-5.223a.664.664 0 0 0-.664-.667"
                ></path>
              </g>
              <path d="M109.795 281.064h2.578q.669.002 1.015.078c.47.063.786.196.953.391q.249.346.25 1.063 0 .282-.046.875-.034.596-.172 1.515l-.266 1.813h6.172q-.252 1.798-.422 2.406-.206.783-.734 1.156-.363.222-.985.297c-.18.023-.468.04-.875.047a55 55 0 0 1-1.53.016h-2.173l-.14 1.03-.563 3.954-.14 1.016h6.156a31 31 0 0 1-.219 1.453q-.095.58-.172.89-.175.704-.531 1.063-.315.314-1.094.453c-.398.055-1.18.078-2.344.078h-2.53c-1.212 0-2.013-.023-2.407-.078-.5-.094-.836-.258-1-.5q-.174-.31-.172-.813v-.453q.076-.56.328-2.093l.14-1.016.563-3.953.14-1.031h-3.968c.094-.54.164-.993.219-1.36l.11-.797c.163-.664.41-1.125.734-1.375q.419-.246 1.109-.328a3.6 3.6 0 0 1 .719-.062h1.64l.563-4.032q.03-.215.031-.343v-.188q-.002-.246-.062-.328a.7.7 0 0 0-.11-.187.7.7 0 0 0-.203-.188.8.8 0 0 0-.187-.187zM122.855 290.752q.247-1.594.329-2.11c.132-.593.32-1.007.562-1.25q.329-.387 1.031-.484.591-.076 1.985-.078h10.765a81 81 0 0 1-.218 1.437 7 7 0 0 1-.188.86c-.148.562-.351.945-.61 1.14q-.362.345-1.265.422a9 9 0 0 1-.844.047 49 49 0 0 1-1.453.016h-5.281q-.206 0-.313.031a.57.57 0 0 0-.328.11q-.14.046-.234.328a1.6 1.6 0 0 0-.063.265 5 5 0 0 1-.078.438l-.672 4.843q-.187 1.564-.328 2.125c-.062.25-.132.477-.203.672a1.7 1.7 0 0 1-.281.485c-.2.218-.484.386-.86.5-.187.043-.523.078-1 .109q-.721.033-1.859.031ZM151.151 286.799q1.23 0 1.735.093c.414.055.695.141.843.266q.423.284.422 1.188v.171c0 .055-.011.125-.03.22 0 .167-.024.417-.063.75q-.05.503-.157 1.265l-.453 3.14-.39 2.844q-.112 1.02-.235 1.64-.129.628-.234.938-.176.598-.563.907c-.21.148-.515.265-.922.359a22 22 0 0 1-.953.078q-.673.033-1.734.031h-6.078q-1.019.002-1.656-.031-.644-.045-.954-.078-.598-.14-.843-.422c-.149-.207-.219-.535-.219-.984v-.172q.061-.576.25-2.266l.172-1.031c.07-.5.133-.914.187-1.25q.092-.515.125-.766.186-.982.547-1.343.389-.387 1.094-.47.592-.093 2.156-.093h5.86q.168.001.296-.016c.083-.007.13-.015.141-.015a.43.43 0 0 0 .266-.14q.077-.077.078-.25.06-.153.078-.61h-6.156c-.5 0-.93-.004-1.282-.016a7 7 0 0 1-.765-.047q-.72-.106-1.031-.5-.252-.389-.344-1.281c0-.176-.008-.398-.016-.672V286.8Zm-7.453 8.906q-.361.001-.406.031c-.063 0-.133.04-.203.11q-.063.063-.11.421 0 .14-.078.47h5.766q.14-.015.156-.016.17-.031.203-.125.061-.047.11-.282.058-.151.093-.61ZM161.092 286.799h10.531a15 15 0 0 1-.25 1.562q-.128.598-.203.906-.176.534-.422.844-.33.362-1.062.531c-.399.055-1.266.079-2.61.079h-5.406a.9.9 0 0 0-.25.03q-.222 0-.297.048a.7.7 0 0 0-.234.312 2 2 0 0 0-.032.25c-.011.094-.039.227-.078.39l-.703 4.97h10.14q-.187 1.61-.327 2.171-.177.846-.563 1.235-.316.314-1.125.453c-.387.055-1.21.078-2.469.078h-6.203l-.25 1.766q-.128.78-.203 1.312-.082.528-.14.844-.08.34-.172.594a1.5 1.5 0 0 1-.22.437q-.314.481-1.062.656-.28.048-.984.094a27 27 0 0 1-1.766.047l1.063-7.656 1.156-8.031c.094-.594.164-1.086.219-1.485q.076-.59.14-.86.247-.871.735-1.187.388-.292 1.11-.328.31-.06.78-.062zM178.142 286.799h10.53a15 15 0 0 1-.25 1.562q-.127.598-.202.906-.176.534-.422.844-.329.362-1.063.531c-.398.055-1.265.079-2.609.079h-5.406a.9.9 0 0 0-.25.03q-.222 0-.297.048a.7.7 0 0 0-.235.312 2 2 0 0 0-.03.25c-.012.094-.04.227-.079.39l-.703 4.97h10.14q-.186 1.61-.328 2.171-.175.846-.562 1.235-.317.314-1.125.453c-.387.055-1.211.078-2.469.078h-6.203l-.25 1.766q-.128.78-.203 1.312-.083.528-.14.844-.08.34-.173.594a1.5 1.5 0 0 1-.218.437q-.315.481-1.063.656-.28.048-.984.094a27 27 0 0 1-1.766.047l1.063-7.656L174 290.72c.094-.594.164-1.086.219-1.485q.075-.59.14-.86.247-.871.735-1.187.388-.292 1.11-.328.31-.06.78-.062zM196.535 281.096l-.64 4.671h-3.985l.094-.765c.094-.531.164-.973.219-1.328q.075-.546.14-.797c.133-.594.32-1.008.563-1.25q.357-.373 1.031-.453.592-.077 2.578-.078m-4.765 5.703h3.984l-.813 5.656-.593 4.312a54 54 0 0 1-.328 1.985q-.112.704-.391 1.125-.346.503-1.125.672-.284.064-.953.109-.675.033-1.735.031l1-7.11ZM202.557 286.83h10.531q-.127.843-.218 1.406-.095.55-.172.86c-.117.542-.305.93-.563 1.156q-.456.392-1.468.469-.27.002-.797.015c-.344.012-.79.016-1.328.016h-5.5a.7.7 0 0 0-.297.047.34.34 0 0 0-.25.093q-.08.082-.172.329-.001.14-.078.562l-.703 4.953h10.14a29 29 0 0 1-.219 1.5q-.094.58-.171.89c-.118.524-.313.891-.594 1.11q-.392.316-1.235.39a8 8 0 0 1-.828.048q-.563.016-1.437.015h-6.266q-1.018.002-1.656-.031-.644-.045-.953-.078-.58-.17-.844-.5-.187-.342-.187-.906v-.188q.03-.31.093-.86.077-.545.188-1.39l.187-1.437a1189 1189 0 0 0 .532-3.75c.062-.414.101-.68.125-.797q.246-1.686.328-2.188.217-.89.593-1.234c.282-.238.649-.383 1.11-.438a4.6 4.6 0 0 1 .828-.062zM215.292 290.783l.234-1.39a8 8 0 0 0 .125-.797q.247-.89.594-1.235.45-.387 1.312-.469.312-.06.875-.062h8.766q.497.002.719.062.234.001.422.032.2.018.312.078.422.081.563.281.326.25.36.86v1.124q0 .189-.048.579-.034.375-.094.937l-.5 3.5-.343 2.484-.563 3.922-.25 1.813q-.08.731-.172 1.234c-.054.344-.093.613-.125.813q-.175.841-.562 1.297-.346.387-1.063.5-.282.029-.953.062c-.437.031-.992.047-1.656.047h-10.14q.204-.892.343-1.484.142-.58.219-.86c.21-.625.476-1.039.812-1.234q.342-.235 1.094-.313c.188-.043.43-.062.734-.062h5.922c.27 0 .489-.008.657-.016h.359c.207-.062.348-.133.422-.203.094-.094.164-.262.219-.5q.092-.25.171-1.094h-6.437q-.784 0-1.328-.015a9 9 0 0 1-.828-.047q-.846-.153-1.094-.61-.174-.31-.172-.843-.001-.141.016-.282.014-.14.015-.28.059-.248.094-.704c.031-.312.07-.691.125-1.14q.061-.28.11-.672.059-.387.124-.891.077-.53.125-.906.059-.388.094-.641.216-1.419.297-2.14.094-.716.094-.735m4.984 0q-.534.002-.64.016-.205 0-.282.14-.035.035-.14.344-.001.11-.078.531l-.344 2.375-.328 2.578h5.093q.218 0 .375-.015c.102-.008.18-.016.235-.016q.248-.045.312-.11.106-.043.141-.218.045-.093.078-.25.03-.169.063-.39l.703-4.985ZM243.652 286.799q1.23 0 1.734.093c.414.055.695.141.844.266q.421.284.422 1.188v.171c0 .055-.012.125-.032.22q-.002.25-.062.75c-.031.335-.086.757-.156 1.265l-.454 3.14-.39 2.844q-.111 1.02-.235 1.64-.129.628-.234.938-.176.598-.562.907c-.211.148-.516.265-.922.359a22 22 0 0 1-.953.078q-.675.033-1.735.031h-6.078q-1.018.002-1.656-.031-.644-.045-.953-.078-.598-.14-.844-.422c-.149-.207-.219-.535-.219-.984v-.172q.061-.576.25-2.266l.172-1.031c.07-.5.133-.914.188-1.25.062-.344.101-.598.125-.766.125-.656.304-1.101.546-1.343q.389-.387 1.094-.47.592-.093 2.156-.093h5.86q.168.001.297-.016c.082-.007.129-.015.14-.015a.43.43 0 0 0 .266-.14q.077-.077.078-.25.06-.153.078-.61h-6.156c-.5 0-.93-.004-1.281-.016a7 7 0 0 1-.766-.047q-.72-.106-1.031-.5-.25-.389-.344-1.281c0-.176-.008-.398-.016-.672V286.8Zm-7.454 8.906q-.361.001-.406.031c-.062 0-.133.04-.203.11q-.063.063-.11.421-.001.14-.077.47h5.765q.14-.015.156-.016.17-.031.204-.125c.039-.032.078-.125.109-.282q.058-.151.094-.61ZM249.623 290.783q.124-.983.219-1.578.106-.61.172-.89.248-.812.672-1.094.326-.247 1-.329.246-.06.656-.062h9.782q.403.002.655.062c.383.055.657.153.813.297q.328.252.39.985v.203q-.001.55-.25 2.406l-.14 1-.563 3.953-.14 1.031q-.11.844-.203 1.407a7 7 0 0 1-.157.828q-.095.345-.203.61a1.3 1.3 0 0 1-.28.437q-.33.363-1.032.53a22 22 0 0 1-.953.079 34 34 0 0 1-1.703.031l.546-3.922.141-1.03.563-3.954.14-1h-5.125a.8.8 0 0 0-.203-.031h-.187c-.118 0-.188.011-.22.031a.6.6 0 0 0-.28.078 1 1 0 0 0-.204.344q0 .11-.078.578l-.562 3.953-.14 1.031a20 20 0 0 1-.235 1.532q-.128.596-.203.906-.175.675-.625 1.031-.363.251-1.125.39-.269.036-.86.048c-.398.011-.89.015-1.484.015l.562-3.922.141-1.03.563-3.954Zm0 0"></path>
            </svg>
          </div>
          <span className="logo-text">TRAFFICGAN</span>
        </div>
        <div className="footer-links">
          <a href="#">Features</a><a href="#">Solutions</a><a href="#">Technology</a><a href="#">Privacy</a>
          <a href="mailto:djedaiet.zakaria@gmail.com">djedaiet.zakaria@gmail.com</a>
        </div>
        <div className="footer-copy">© 2025 TrafficGAN. All rights reserved.</div>
      </footer>

      {/* MODAL */}
      <div
        className={`modal-overlay ${isModalOpen ? 'open' : ''}`}
        onClick={(e) => e.target === e.currentTarget && handleModalClose()}
      >
        <div className="modal">
          <button className="modal-close" onClick={handleModalClose}>✕</button>

          {!isSubmitted ? (
            <form onSubmit={handleFormSubmit}>
              <h3>REQUEST DEMO</h3>
              <p className="modal-sub">Tell us about your city and we'll reach out within 24 hours.</p>

              <div className="form-section-label">YOUR DETAILS</div>
              <div className="form-row">
                <div className="form-group"><label>NAME</label><input type="text" name="name" placeholder="Full name" value={formData.name} onChange={handleInputChange} required /></div>
                <div className="form-group"><label>EMAIL</label><input type="email" name="email" placeholder="you@city.gov" value={formData.email} onChange={handleInputChange} required /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>ORGANIZATION</label><input type="text" name="organization" placeholder="City / Department" value={formData.organization} onChange={handleInputChange} required /></div>
                <div className="form-group"><label>CITY</label><input type="text" name="city" placeholder="City name" value={formData.city} onChange={handleInputChange} required /></div>
              </div>


              <div className="form-group" style={{ marginTop: '12px' }}>
                <label>INQUIRY TYPE</label>
                <select
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    background: 'var(--bg2)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '9px 12px',
                    color: 'var(--text)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '13px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="Demo / Services">Platform Demo & Services</option>
                  <option value="Investment">Investment Opportunities</option>
                  <option value="Collaboration">Partnership / Collaboration</option>
                </select>
              </div>



              <div className="svc-picker-label">SERVICES YOU'RE INTERESTED IN</div>
              <div className="svc-picker-grid">
                {ALL_ITEMS.map(item => (
                  <div
                    key={item.id}
                    className={`svc-pick-item ${selectedServices.includes(item.id) ? 'checked' : ''}`}
                    onClick={() => toggleServiceSelection(item.id)}
                  >
                    <div className="svc-pick-check"><span className="svc-pick-check-icon">✓</span></div>
                    <span className="svc-pick-name">{item.name}</span>
                  </div>
                ))}
              </div>

              <div className="form-section-label" style={{ marginTop: '18px' }}>ADDITIONAL INFO</div>
              <div className="form-group">
                <label>MESSAGE</label>
                <textarea name="message" rows={3} placeholder="Number of cameras, current infrastructure, specific needs..." value={formData.message} onChange={handleInputChange}></textarea>
              </div>

              <button type="submit" className="form-submit">SUBMIT REQUEST →</button>
            </form>
          ) : (
            <div className="success-msg" style={{ display: 'block' }}>
              <div style={{ fontSize: '42px', marginBottom: '12px' }}>✅</div>
              <h4>REQUEST RECEIVED</h4>
              <p>Our team will reach out within 24 hours. Check your inbox soon.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}