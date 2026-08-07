import React, { useState } from 'react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/common/Card';
import Modal from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { PropertyCardSkeleton, ViewerSkeleton } from '../components/common/Skeleton';
import { Eye, Sparkles, PlusCircle, Search, Compass, ShieldCheck } from 'lucide-react';

export default function DesignSystemShowcase() {
  const [modalOpen, setModalOpen] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const toggleLoading = () => {
    setBtnLoading(true);
    setTimeout(() => setBtnLoading(false), 2000);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="space-y-2 border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          Component Library & Design Tokens
        </div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">ViewRoom Design System</h1>
        <p className="text-slate-400 text-sm max-w-xl">
          Central UI primitives and tokens designed for high performance, luxury aesthetic, and responsive interaction.
        </p>
      </div>

      {/* Buttons Showcase */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          1. Button Variants & States
        </h2>
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex flex-wrap gap-4 items-center">
            <Button variant="primary" icon={PlusCircle} onClick={toggleLoading} loading={btnLoading}>
              Primary Emerald
            </Button>
            <Button variant="secondary" icon={Compass}>
              Secondary Slate
            </Button>
            <Button variant="gold" icon={Sparkles}>
              Luxury Gold
            </Button>
            <Button variant="outline" icon={Eye}>
              Outline Teal
            </Button>
            <Button variant="ghost">
              Ghost Button
            </Button>
            <Button variant="danger">
              Danger Action
            </Button>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex flex-wrap gap-4 items-center">
            <Button size="xs" variant="primary">Extra Small</Button>
            <Button size="sm" variant="primary">Small</Button>
            <Button size="md" variant="primary">Medium</Button>
            <Button size="lg" variant="primary">Large Button</Button>
            <Button size="md" variant="primary" disabled>Disabled</Button>
          </div>
        </div>
      </section>

      {/* Status Badges Showcase */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white">2. Property Workflow Status Badges (RBAC & Workflow)</h2>
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex flex-wrap gap-3 items-center">
            <Badge status="DRAFT" dot />
            <Badge status="SUBMITTED" dot />
            <Badge status="UNDER_REVIEW" dot />
            <Badge status="PUBLISHED" dot />
            <Badge status="REJECTED" dot />
          </div>
          <div className="flex flex-wrap gap-3 items-center pt-2">
            <Badge variant="emerald">House</Badge>
            <Badge variant="gold">Apartment</Badge>
            <Badge variant="blue">Hotel Suite</Badge>
            <Badge variant="purple">Commercial Office</Badge>
          </div>
        </div>
      </section>

      {/* Form Elements Showcase */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white">3. Inputs & Select Dropdowns</h2>
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Property Title" placeholder="e.g. Modern Sunset Villa" icon={Eye} />
          <Select
            label="Property Category"
            options={[
              { value: 'house', label: 'Luxury House' },
              { value: 'apartment', label: 'Modern Apartment' },
              { value: 'hotel', label: 'Hotel / Resort' },
              { value: 'office', label: 'Corporate Office' },
            ]}
          />
        </div>
      </section>

      {/* Card & Modal Showcase */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white">4. Cards & Overlay Dialogs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card hover>
            <CardHeader>
              <CardTitle>Spatial Property Card</CardTitle>
              <CardDescription>Interactive container with glassmorphic styling.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-300">
                Click below to launch an accessible modal dialog popup window.
              </p>
            </CardContent>
            <CardFooter>
              <Button size="sm" variant="primary" onClick={() => setModalOpen(true)}>
                Open Dialog Modal
              </Button>
            </CardFooter>
          </Card>

          <Modal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            title="360° Hotspot Builder Dialog"
            subtitle="Configure spatial target scene properties."
          >
            <div className="space-y-4">
              <Input label="Hotspot Label" placeholder="e.g. Move to Master Bedroom" />
              <Select
                label="Target Scene"
                options={[
                  { value: 'scene-1', label: 'Living Room' },
                  { value: 'scene-2', label: 'Master Bedroom' },
                  { value: 'scene-3', label: 'Balcony View' },
                ]}
              />
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
                <Button variant="primary" onClick={() => setModalOpen(false)}>Save Hotspot</Button>
              </div>
            </div>
          </Modal>

          <PropertyCardSkeleton />
        </div>
      </section>

      {/* 360 Loading Skeleton */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white">5. 360 Viewer Shimmer Loader</h2>
        <ViewerSkeleton />
      </section>
    </div>
  );
}
