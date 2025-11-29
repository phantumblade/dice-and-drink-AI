import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  Users, Trophy, Calendar, TrendingUp, Trash2, Plus,
  Swords, ShoppingBag, Scroll, Edit, Filter, Search, Settings, Bell, Check, X
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../contexts/ToastContext';
import CreateTournamentModal from '../components/CreateTournamentModal';
import CreateProductModal from '../components/CreateProductModal';
import GenerateCampaignModal from '../components/GenerateCampaignModal';
import EditProductModal from '../components/EditProductModal';
import EditTournamentModal from '../components/EditTournamentModal';
import EditCampaignModal from '../components/EditCampaignModal';

const COLORS = ['#8b5cf6', '#ec4899', '#84cc16', '#06b6d4', '#f59e0b'];

const Dashboard: React.FC = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeTournaments: 0,
    finishedTournaments: 0,
    upcomingTournaments: 0
  });
  const [chartsData, setChartsData] = useState({
    tournamentsPerYear: [],
    tournamentsPerCategory: [],
    participantsPerGame: []
  });
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [showTournamentModal, setShowTournamentModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);

  // Edit Modal States
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editingTournament, setEditingTournament] = useState<any>(null);
  const [editingCampaign, setEditingCampaign] = useState<any>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchData();
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      if (res.data.length > 0) {
        setNotifications(res.data);
        setShowNotificationModal(true);
      }
    } catch (error) {
      console.error('Failed to fetch notifications');
    }
  };

  const handleCloseNotifications = async () => {
    setShowNotificationModal(false);
    // Mark all as read
    for (const notif of notifications) {
      await api.post(`/notifications/${notif.id}/read`);
    }
    setNotifications([]);
  };

  const fetchData = async () => {
    try {
      const [statsRes, chartsRes, usersRes, productsRes, tournamentsRes, allTournamentsRes, campaignsRes, requestsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/charts'),
        api.get('/admin/users'),
        api.get('/products'),
        api.get('/tournaments'),
        api.get('/tournaments'), // Duplicate call? Let's keep it to match existing code structure for now, or remove if redundant.
        api.get('/campaigns'),
        api.get('/campaigns/requests/pending')
      ]);
      setStats(statsRes.data);
      setChartsData(chartsRes.data);
      setUsers(usersRes.data);
      setProducts(productsRes.data);
      setTournaments(tournamentsRes.data);
      setCampaigns(campaignsRes.data);
      setRequests(requestsRes.data);

    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
      showToast('Errore nel caricamento della dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo utente? Questa azione è irreversibile.')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(users.filter(u => u.id !== userId));
      showToast('Utente eliminato con successo', 'success');
    } catch (error) {
      showToast('Errore durante l\'eliminazione dell\'utente', 'error');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Eliminare questo prodotto?')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter(p => p.id !== id));
      showToast('Prodotto eliminato', 'success');
    } catch (error) {
      showToast('Errore eliminazione prodotto', 'error');
    }
  };

  const handleDeleteTournament = async (id: string) => {
    if (!confirm('Eliminare questo torneo?')) return;
    try {
      await api.delete(`/tournaments/${id}`);
      setTournaments(tournaments.filter(t => t.id !== id));
      showToast('Torneo eliminato', 'success');
    } catch (error) {
      showToast('Errore eliminazione torneo', 'error');
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    if (!confirm('Eliminare questa campagna?')) return;
    try {
      await api.delete(`/campaigns/${id}`);
      setCampaigns(campaigns.filter(c => c.id !== id));
      showToast('Campagna eliminata', 'success');
    } catch (error) {
      showToast('Errore eliminazione campagna', 'error');
    }
  };

  const StatCard = ({ title, value, icon: Icon, colorClass }: { title: string; value: number | string; icon: any; colorClass: string }) => (
    <div className="bg-white p-6 border-2 border-black shadow-neo hover:-translate-y-1 transition-transform">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-black font-bold uppercase text-xs tracking-wider">{title}</p>
          <h3 className="text-4xl font-black mt-2">{value}</h3>
        </div>
        <div className={`p-3 border-2 border-black ${colorClass} shadow-neo-sm`}>
          <Icon className="w-6 h-6 text-black" />
        </div>
      </div>
    </div>
  );

  const TabButton = ({ id, label, icon: Icon }: { id: string; label: string; icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-6 py-3 font-black uppercase border-2 border-black transition-all ${activeTab === id
        ? 'bg-black text-white shadow-neo'
        : 'bg-white text-black hover:bg-gray-100'
        }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );

  if (loading) return <div className="p-12 text-center font-black text-2xl">CARICAMENTO DATI...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-5xl font-black uppercase italic">Admin Dashboard</h1>
          <p className="text-gray-600 font-bold mt-2">Supervisione e Gestione Totale</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-neo-lime border-2 border-black px-4 py-2 font-black uppercase shadow-neo hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 mb-8 border-b-2 border-black pb-4">
        <TabButton id="overview" label="Panoramica" icon={TrendingUp} />
        <TabButton id="products" label="Prodotti" icon={ShoppingBag} />
        <TabButton id="tournaments" label="Tornei" icon={Swords} />
        <TabButton id="campaigns" label="Campagne" icon={Scroll} />
        <TabButton id="requests" label={`Richieste (${requests.length})`} icon={Bell} />
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard title="Utenti Totali" value={stats.totalUsers} icon={Users} colorClass="bg-neo-cyan" />
            <StatCard title="Tornei Attivi" value={stats.activeTournaments} icon={Swords} colorClass="bg-neo-pink text-white" />
            <StatCard title="Tornei Conclusi" value={stats.finishedTournaments} icon={Trophy} colorClass="bg-neo-yellow" />
            <StatCard title="In Arrivo" value={stats.upcomingTournaments} icon={Calendar} colorClass="bg-neo-violet text-white" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-6 border-2 border-black shadow-neo">
              <h3 className="text-xl font-black mb-6 uppercase border-b-2 border-black pb-2 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" /> Partecipazione per Gioco
              </h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartsData.participantsPerGame}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#000" tick={{ fontWeight: 'bold', fontSize: 12 }} />
                    <YAxis stroke="#000" tick={{ fontWeight: 'bold' }} />
                    <Tooltip />
                    <Bar dataKey="participants" fill="#8b5cf6" stroke="#000" strokeWidth={2} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 border-2 border-black shadow-neo">
              <h3 className="text-xl font-black mb-6 uppercase border-b-2 border-black pb-2 flex items-center gap-2">
                <Trophy className="w-5 h-5" /> Tornei per Categoria
              </h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartsData.tournamentsPerCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="type"
                    >
                      {chartsData.tournamentsPerCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#000" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white border-2 border-black shadow-neo overflow-hidden">
            <div className="p-6 border-b-2 border-black flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-black uppercase flex items-center gap-2">
                <Users className="w-5 h-5" /> Gestione Utenti
              </h3>
              <span className="bg-black text-white px-3 py-1 font-bold text-xs rounded-full">{users.length} Utenti</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100 border-b-2 border-black">
                  <tr>
                    <th className="p-4 font-black uppercase text-xs tracking-wider">Utente</th>
                    <th className="p-4 font-black uppercase text-xs tracking-wider">Ruolo</th>
                    <th className="p-4 font-black uppercase text-xs tracking-wider">Iscritto dal</th>
                    <th className="p-4 font-black uppercase text-xs tracking-wider text-center">Attività</th>
                    <th className="p-4 font-black uppercase text-xs tracking-wider text-right">Azioni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-neo-bg/30 transition-colors">
                      <td className="p-4">
                        <div>
                          <p className="font-bold text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-xs font-bold uppercase border border-black ${user.role === 'admin' ? 'bg-neo-violet text-white' :
                          user.role === 'staff' ? 'bg-neo-cyan' : 'bg-gray-100'
                          }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4 text-sm font-medium text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-3 text-xs font-bold">
                          <span className="bg-neo-lime/20 px-2 py-1 rounded border border-neo-lime text-green-800" title="Prenotazioni">
                            {user._count.bookings} P
                          </span>
                          <span className="bg-neo-pink/20 px-2 py-1 rounded border border-neo-pink text-pink-800" title="Tornei">
                            {user._count.registeredTournaments} T
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                            title="Rimuovi Utente"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cerca prodotti..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border-2 border-black font-bold focus:outline-none focus:ring-2 focus:ring-neo-cyan"
                />
              </div>
            </div>
            <button
              onClick={() => setShowProductModal(true)}
              className="bg-neo-cyan border-2 border-black px-4 py-2 font-black uppercase shadow-neo hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Nuovo Prodotto
            </button>
          </div>

          <div className="bg-white border-2 border-black shadow-neo overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-100 border-b-2 border-black">
                <tr>
                  <th className="p-4 font-black uppercase text-xs tracking-wider">Prodotto</th>
                  <th className="p-4 font-black uppercase text-xs tracking-wider">Categoria</th>
                  <th className="p-4 font-black uppercase text-xs tracking-wider">Prezzo</th>
                  <th className="p-4 font-black uppercase text-xs tracking-wider text-right">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(product => (
                  <tr key={product.id} className="hover:bg-neo-bg/30 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="w-10 h-10 object-cover border border-black" />
                      <span className="font-bold">{product.name}</span>
                    </td>
                    <td className="p-4 uppercase text-xs font-bold text-gray-600">{product.category}</td>
                    <td className="p-4 font-bold">€{product.price.toFixed(2)}</td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      <button onClick={() => setEditingProduct(product)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-full"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-full"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TOURNAMENTS TAB */}
      {activeTab === 'tournaments' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cerca tornei..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border-2 border-black font-bold focus:outline-none focus:ring-2 focus:ring-neo-violet"
                />
              </div>
            </div>
            <button
              onClick={() => setShowTournamentModal(true)}
              className="bg-neo-lime border-2 border-black px-4 py-2 font-black uppercase shadow-neo hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Nuovo Torneo
            </button>
          </div>

          <div className="bg-white border-2 border-black shadow-neo overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-100 border-b-2 border-black">
                <tr>
                  <th className="p-4 font-black uppercase text-xs tracking-wider">Torneo</th>
                  <th className="p-4 font-black uppercase text-xs tracking-wider">Data</th>
                  <th className="p-4 font-black uppercase text-xs tracking-wider">Costo</th>
                  <th className="p-4 font-black uppercase text-xs tracking-wider">Iscritti</th>
                  <th className="p-4 font-black uppercase text-xs tracking-wider">Stato</th>
                  <th className="p-4 font-black uppercase text-xs tracking-wider text-right">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tournaments.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase())).map(tournament => (
                  <tr key={tournament.id} className="hover:bg-neo-bg/30 transition-colors">
                    <td className="p-4 font-bold">{tournament.title}</td>
                    <td className="p-4 text-sm">{new Date(tournament.date).toLocaleDateString()}</td>
                    <td className="p-4">
                      {tournament.entryFee === 0 ? (
                        <span className="bg-neo-lime text-black px-2 py-1 text-xs font-black uppercase border border-black shadow-neo-sm">
                          GRATIS
                        </span>
                      ) : (
                        <span className="font-black text-neo-violet">
                          € {tournament.entryFee.toFixed(2)}
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-sm font-bold">{tournament.filled}/{tournament.slots}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-bold uppercase border border-black ${tournament.status === 'upcoming' ? 'bg-neo-lime' :
                        tournament.status === 'ongoing' ? 'bg-neo-yellow' : 'bg-gray-200'
                        }`}>
                        {tournament.status}
                      </span>
                    </td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      <button onClick={() => setEditingTournament(tournament)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-full"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteTournament(tournament.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-full"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CAMPAIGNS TAB */}
      {activeTab === 'campaigns' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cerca campagne..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border-2 border-black font-bold focus:outline-none focus:ring-2 focus:ring-neo-pink"
                />
              </div>
            </div>
            <button
              onClick={() => setShowCampaignModal(true)}
              className="bg-neo-pink border-2 border-black px-4 py-2 font-black uppercase shadow-neo hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Genera Campagna
            </button>
          </div>

          <div className="bg-white border-2 border-black shadow-neo overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-100 border-b-2 border-black">
                <tr>
                  <th className="p-4 font-black uppercase text-xs tracking-wider">Campagna</th>
                  <th className="p-4 font-black uppercase text-xs tracking-wider">Sistema</th>
                  <th className="p-4 font-black uppercase text-xs tracking-wider">Giocatori</th>
                  <th className="p-4 font-black uppercase text-xs tracking-wider">Piattaforma</th>
                  <th className="p-4 font-black uppercase text-xs tracking-wider">DM</th>
                  <th className="p-4 font-black uppercase text-xs tracking-wider">Stato</th>
                  <th className="p-4 font-black uppercase text-xs tracking-wider text-right">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {campaigns.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase())).map(campaign => (
                  <tr key={campaign.id} className="hover:bg-neo-bg/30 transition-colors">
                    <td className="p-4">
                      <div className="font-bold">{campaign.title}</div>
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {(() => {
                          try {
                            const tags = JSON.parse(campaign.tags || '[]');
                            return Array.isArray(tags) ? tags.slice(0, 3).map((tag: string, i: number) => (
                              <span key={i} className="text-[10px] uppercase font-bold bg-gray-200 px-1 border border-black">{tag}</span>
                            )) : null;
                          } catch (e) { return null; }
                        })()}
                      </div>
                    </td>
                    <td className="p-4 text-sm">{campaign.system}</td>
                    <td className="p-4 text-sm font-bold">
                      {campaign.currentPlayers || 0} / {campaign.maxPlayers || 4}
                    </td>
                    <td className="p-4 text-sm">{campaign.platform || 'In Person'}</td>
                    <td className="p-4 text-sm font-bold">{campaign.dm?.name || 'N/A'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-bold uppercase border border-black text-white ${campaign.status === 'RECRUITING' ? 'bg-green-500' :
                        campaign.status === 'ACTIVE' ? 'bg-blue-500' :
                          campaign.status === 'PAUSED' ? 'bg-yellow-500' : 'bg-gray-500'
                        }`}>
                        {campaign.status}
                      </span>
                    </td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      <button
                        onClick={() => navigate(`/campaigns/${campaign.id}`)}
                        className="bg-black text-white hover:bg-gray-800 px-3 py-1 text-xs font-black uppercase flex items-center gap-2 shadow-neo-sm"
                        title="Apri Campagna"
                      >
                        <Swords className="w-3 h-3" /> Apri
                      </button>
                      <button onClick={() => setEditingCampaign(campaign)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-full" title="Modifica Rapida"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteCampaign(campaign.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-full" title="Elimina"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Modals */}
      {showTournamentModal && (
        <CreateTournamentModal
          onClose={() => setShowTournamentModal(false)}
          onCreated={fetchData}
        />
      )}
      {showProductModal && (
        <CreateProductModal
          onClose={() => setShowProductModal(false)}
          onCreated={fetchData}
        />
      )}
      {showCampaignModal && (
        <GenerateCampaignModal
          onClose={() => setShowCampaignModal(false)}
          onGenerated={fetchData}
        />
      )}

      {/* Edit Modals */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onUpdated={fetchData}
        />
      )}
      {editingTournament && (
        <EditTournamentModal
          tournament={editingTournament}
          onClose={() => setEditingTournament(null)}
          onUpdated={fetchData}
        />
      )}
      {editingCampaign && (
        <EditCampaignModal
          campaign={editingCampaign}
          onClose={() => setEditingCampaign(null)}
          onUpdated={fetchData}
        />
      )}

      {/* REQUESTS TAB */}
      {activeTab === 'requests' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white border-2 border-black shadow-neo overflow-hidden">
            <div className="p-6 border-b-2 border-black bg-gray-50">
              <h3 className="text-xl font-black uppercase flex items-center gap-2">
                <Bell className="w-5 h-5" /> Richieste in Attesa
              </h3>
            </div>
            <table className="w-full text-left">
              <thead className="bg-gray-100 border-b-2 border-black">
                <tr>
                  <th className="p-4 font-black uppercase text-xs tracking-wider">Utente</th>
                  <th className="p-4 font-black uppercase text-xs tracking-wider">Personaggio</th>
                  <th className="p-4 font-black uppercase text-xs tracking-wider">Campagna</th>
                  <th className="p-4 font-black uppercase text-xs tracking-wider text-right">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {requests.length === 0 ? (
                  <tr><td colSpan={4} className="p-8 text-center font-bold text-gray-500">Nessuna richiesta in attesa.</td></tr>
                ) : (
                  requests.map(req => (
                    <tr key={req.id} className="hover:bg-neo-bg/30 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <img src={req.user.avatar} alt={req.user.name} className="w-8 h-8 rounded-full border border-black" />
                        <span className="font-bold">{req.user.name}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-bold">{req.character.name}</span>
                        <span className="text-xs text-gray-500 block">{req.character.class} Lvl {req.character.level}</span>
                      </td>
                      <td className="p-4 font-bold">{req.campaign.title}</td>
                      <td className="p-4 text-right flex justify-end gap-2">
                        <button
                          onClick={async () => {
                            await api.post(`/campaigns/requests/${req.id}/approve`);
                            fetchData();
                            showToast('Richiesta approvata', 'success');
                          }}
                          className="bg-green-500 text-white p-2 border-2 border-black shadow-neo-sm hover:-translate-y-1 transition-transform"
                          title="Approva"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={async () => {
                            await api.post(`/campaigns/requests/${req.id}/reject`);
                            fetchData();
                            showToast('Richiesta rifiutata', 'error');
                          }}
                          className="bg-red-500 text-white p-2 border-2 border-black shadow-neo-sm hover:-translate-y-1 transition-transform"
                          title="Rifiuta"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      {showNotificationModal && notifications.length > 0 && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white border-4 border-black shadow-neo max-w-md w-full p-6 animate-in zoom-in-95 duration-300 relative">
            <button onClick={handleCloseNotifications} className="absolute top-2 right-2 text-gray-500 hover:text-black">
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-black uppercase italic mb-4 flex items-center gap-2">
              <Bell className="w-6 h-6" /> Notifiche
            </h3>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {notifications.map(notif => (
                <div key={notif.id} className={`p-4 border-2 border-black ${notif.type === 'SUCCESS' ? 'bg-green-100' : notif.type === 'ERROR' ? 'bg-red-100' : 'bg-blue-100'}`}>
                  <p className="font-bold">{notif.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{new Date(notif.createdAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <button onClick={handleCloseNotifications} className="w-full mt-6 bg-black text-white font-black uppercase py-3 hover:bg-gray-800 transition-colors">
              Ho Capito
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;