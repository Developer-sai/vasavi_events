import React from "react";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { getAnalyticsSummary } from "@/lib/db/events";
import {
  BarChart3,
  Eye,
  TrendingUp,
  Smartphone,
  QrCode,
  ExternalLink,
  CalendarHeart,
  Globe,
} from "lucide-react";

export default async function AdminAnalyticsPage() {
  const analytics = await getAnalyticsSummary();

  const maxViews = Math.max(...analytics.views_over_time.map((v) => v.views), 1);

  return (
    <div className="flex-1 flex flex-col bg-[#FAF8F5]">
      <AdminHeader
        title="Gallery Telemetry & Analytics"
        subtitle="Track guest views, mobile WhatsApp link opens, and client engagement without invasive tracking."
      />

      <div className="p-6 max-w-7xl w-full mx-auto space-y-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#EBE6DF] rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-[#7A6F64] font-medium font-sans">
                Total Views
              </span>
              <div className="p-2 rounded-xl bg-[#FAF8F5] border border-[#EBE6DF] text-[#C59350]">
                <Eye className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <div className="font-serif text-3xl text-[#1A1714] font-medium">
                {analytics.total_views.toLocaleString()}
              </div>
              <p className="text-[11px] text-[#A69C90] mt-1 font-sans">
                Across all active and archived galleries
              </p>
            </div>
          </div>

          <div className="bg-white border border-[#EBE6DF] rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-[#7A6F64] font-medium font-sans">
                Active Events
              </span>
              <div className="p-2 rounded-xl bg-[#FAF8F5] border border-[#EBE6DF] text-[#C59350]">
                <CalendarHeart className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <div className="font-serif text-3xl text-[#1A1714] font-medium">
                {analytics.active_events}
              </div>
              <p className="text-[11px] text-[#A69C90] mt-1 font-sans">
                Public links currently accessible
              </p>
            </div>
          </div>

          <div className="bg-white border border-[#EBE6DF] rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-[#7A6F64] font-medium font-sans">
                Ceremonial Folders
              </span>
              <div className="p-2 rounded-xl bg-[#FAF8F5] border border-[#EBE6DF] text-[#C59350]">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <div className="font-serif text-3xl text-[#1A1714] font-medium">
                {analytics.total_folders}
              </div>
              <p className="text-[11px] text-[#A69C90] mt-1 font-sans">
                Haldi, Highlights, Sangeet & shoots
              </p>
            </div>
          </div>

          <div className="bg-white border border-[#EBE6DF] rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-[#7A6F64] font-medium font-sans">
                Mobile WhatsApp Traffic
              </span>
              <div className="p-2 rounded-xl bg-[#FAF8F5] border border-[#EBE6DF] text-[#C59350]">
                <Smartphone className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <div className="font-serif text-3xl text-[#1A1714] font-medium">
                84.2%
              </div>
              <p className="text-[11px] text-[#A69C90] mt-1 font-sans">
                Wedding guests primarily open via phone
              </p>
            </div>
          </div>
        </div>

        {/* Traffic Visualizer & Channel Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Daily Views Bar Chart */}
          <div className="lg:col-span-2 bg-white border border-[#EBE6DF] rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-serif text-lg font-medium text-[#1A1714]">
                  Recent Gallery Views
                </h3>
                <p className="text-xs text-[#7A6F64]">
                  Daily visitor engagement across shared wedding links
                </p>
              </div>
              <span className="text-xs font-mono text-[#C59350] bg-[#C59350]/10 px-2.5 py-1 rounded-full border border-[#C59350]/20">
                Last 7 Days
              </span>
            </div>

            {/* Visualizer Bar Graph */}
            <div className="h-48 flex items-end justify-between gap-3 pt-4 px-2">
              {analytics.views_over_time.map((item, idx) => {
                const heightPercent = Math.max(12, (item.views / maxViews) * 100);

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[10px] font-mono text-[#7A6F64] opacity-0 group-hover:opacity-100 transition">
                      {item.views}
                    </span>
                    <div className="w-full bg-[#FAF8F5] rounded-xl overflow-hidden flex items-end h-full">
                      <div
                        className="w-full bg-gradient-to-t from-[#1A1714] to-[#C59350] rounded-xl transition-all duration-500 group-hover:brightness-110"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-sans text-[#7A6F64] tracking-wider uppercase font-medium">
                      {item.date}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Device & Acquisition */}
          <div className="bg-white border border-[#EBE6DF] rounded-2xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="font-serif text-lg font-medium text-[#1A1714] mb-1">
                Guest Acquisition Channels
              </h3>
              <p className="text-xs text-[#7A6F64] mb-6">
                How clients and wedding guests discover Subbu's links
              </p>

              <div className="space-y-4 text-xs font-sans">
                <div>
                  <div className="flex justify-between mb-1 text-[#1A1714] font-medium">
                    <span className="flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-[#C59350]" />
                      WhatsApp Direct Share
                    </span>
                    <span>74%</span>
                  </div>
                  <div className="w-full bg-[#FAF8F5] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#25D366] h-full rounded-full" style={{ width: "74%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1 text-[#1A1714] font-medium">
                    <span className="flex items-center gap-1.5">
                      <QrCode className="w-3.5 h-3.5 text-[#C59350]" />
                      Hall Entrance QR Display
                    </span>
                    <span>18%</span>
                  </div>
                  <div className="w-full bg-[#FAF8F5] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#C59350] h-full rounded-full" style={{ width: "18%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1 text-[#1A1714] font-medium">
                    <span className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-[#C59350]" />
                      Direct Browser Link
                    </span>
                    <span>8%</span>
                  </div>
                  <div className="w-full bg-[#FAF8F5] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#1A1714] h-full rounded-full" style={{ width: "8%" }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EBE6DF] mt-6 text-[11px] text-[#7A6F64]">
              💡 <strong>Subbu Pro Tip</strong>: Printing the QR code on the welcome board at Vasavi Kalyana Mandapam boosts immediate guest viewing by over 40%!
            </div>
          </div>
        </div>

        {/* Top Galleries Table */}
        <div className="bg-white border border-[#EBE6DF] rounded-2xl shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-[#EBE6DF]">
            <h3 className="font-serif text-lg font-medium text-[#1A1714]">
              Top Viewed Event Galleries
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#FAF8F5] border-b border-[#EBE6DF] text-[#7A6F64] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-6 font-medium">Event Gallery</th>
                  <th className="py-3.5 px-6 font-medium">Ceremony Date</th>
                  <th className="py-3.5 px-6 font-medium">Photos</th>
                  <th className="py-3.5 px-6 font-medium">Total Views</th>
                  <th className="py-3.5 px-6 font-medium">Status</th>
                  <th className="py-3.5 px-6 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBE6DF] text-[#1A1714]">
                {analytics.top_events.map((e) => (
                  <tr key={e.id} className="hover:bg-[#FAF8F5]/60 transition">
                    <td className="py-4 px-6 font-medium">
                      <span className="font-serif text-sm block">{e.name}</span>
                      <span className="text-[10px] text-[#7A6F64] font-mono">
                        /gallery/{e.slug}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-[#7A6F64]">{e.event_date}</td>
                    <td className="py-4 px-6 font-mono">{e.photos} photos</td>
                    <td className="py-4 px-6 font-mono font-bold text-[#C59350]">
                      {e.views}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          e.status === "Expired"
                            ? "bg-rose-100 text-rose-700"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {e.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/gallery/${e.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-xs text-[#C59350] hover:text-[#A9753C] font-medium"
                      >
                        Open <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
