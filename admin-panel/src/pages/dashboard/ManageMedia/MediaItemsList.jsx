import React, { useState } from "react";
import { Plus, Trash2, Edit3 } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import {
  useGetItemsQuery,
  useDeleteItemMutation,
} from "../../../redux/api/apiSlice";
import Searchbar from "../../../components/Searchbar";
import CommonImage from "../../../components/CommonImage";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const MediaItemsList = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  const { data, isLoading } = useGetItemsQuery(
    `media-items?page=${page}&limit=${limit}&sortBy=${sortBy}&order=${order}&search=${searchQuery}&category=${categoryFilter}`,
  );

  const mediaItems = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;

  const [deleteItem] = useDeleteItemMutation();

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this media item?")) return;
    try {
      await deleteItem(`media-items/${id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to delete item");
    }
  };

  const handleSort = (field) => {
    const isAsc = sortBy === field && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setSortBy(field);
    setPage(1);
  };

  const theme = {
    main: isDarkMode
      ? "bg-[#0b0e14] text-slate-300"
      : "bg-gray-50 text-gray-700",
    card: isDarkMode
      ? "bg-[#151b28] border border-gray-800 text-white"
      : "bg-white border border-gray-200 text-gray-700",
    header: isDarkMode
      ? "bg-[#1f2637] text-gray-400"
      : "bg-gray-100 text-gray-500",
    divider: isDarkMode ? "divide-gray-800" : "divide-gray-100",
  };

  const SortIcon = ({ field }) => (
    <span className="opacity-50 text-[10px]">
      {sortBy === field ? (order === "asc" ? "▲" : "▼") : "↕"}
    </span>
  );

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center text-sm font-medium">
        Loading...
      </div>
    );

  return (
    <div className={`min-h-screen w-full flex flex-col ${theme.main}`}>
      <main className="flex-1 overflow-y-auto ">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 gap-2">
            <div className="flex-1 min-w-[150px]">
              <Searchbar
                placeholder="Search media..."
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <button
                onClick={() => navigate("/dashboard/Manage-media-items/add")}
                className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-(--primary) text-white rounded-lg text-xs font-bold hover:opacity-90 w-full sm:w-auto"
              >
                <Plus size={16} /> Add Media
              </button>
            </div>
          </div>

          {/* Table */}
          <div className={`${theme.card} rounded-xl overflow-hidden shadow-sm`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[600px] md:min-w-full">
                <thead
                  className={`uppercase tracking-wider font-bold ${theme.header}`}
                >
                  <tr>
                    <th className="px-4 py-3 w-10">#</th>
                    <th
                      className="px-4 py-3 cursor-pointer hover:text-(--primary) transition-colors"
                      onClick={() => handleSort("title")}
                    >
                      <div className="flex items-center gap-1">
                        Title <SortIcon field="title" />
                      </div>
                    </th>
                    <th className="px-4 py-3 hidden sm:table-cell">Category</th>
                    <th className=" w-32">Media</th>
                    <th className="px-4 py-3 text-right w-24">Action</th>
                  </tr>
                </thead>

                <tbody className={`divide-y ${theme.divider}`}>
                  {mediaItems.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-10 text-center opacity-40"
                      >
                        No media items found
                      </td>
                    </tr>
                  ) : (
                    mediaItems.map((item, idx) => (
                      <tr
                        key={item._id}
                        className="hover:bg-(--primary)/5 transition-colors"
                      >
                        <td className="px-4 py-2.5 font-mono opacity-50 text-[10px]">
                          {(page - 1) * limit + idx + 1}
                        </td>
                        <td className="px-4 py-2.5 font-semibold">
                          {item.title}
                        </td>
                        <td className="px-4 py-2.5 hidden sm:table-cell">
                          {item.category || "-"}
                        </td>
                        <td className="px-4 py-2.5">
                          <MediaPreview
                            type={item.type}
                            link={item.link}
                            icon={item.icon}
                            title={item.title}
                          />
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() =>
                                navigate(
                                  `/dashboard/Manage-media-items/edit/${item._id}`,
                                )
                              }
                              className="p-1.5 cursor-pointer hover:text-(--primary) hover:bg-(--primary)/10 rounded-md transition-all"
                              title="Edit"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="p-1.5 cursor-pointer hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div
              className={`flex flex-col sm:flex-row items-center justify-between p-3 border-t ${theme.divider} gap-2 sm:gap-0`}
            >
              <span className="text-[11px] opacity-60">
                Showing {mediaItems.length} entries
              </span>
              <div className="flex items-center gap-1 flex-wrap sm:flex-nowrap">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="p-1.5 border rounded-md disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer hover:border-(--primary) hover:text-(--primary) transition-colors"
                >
                  <FiChevronLeft size={16} />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                    className={`w-7 h-7 text-[11px] rounded-md border transition-all cursor-pointer ${
                      page === i + 1
                        ? "bg-(--primary) text-white border-(--primary) shadow-sm"
                        : "hover:border-(--primary) hover:text-(--primary) border-transparent"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="p-1.5 border rounded-md disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer hover:border-(--primary) hover:text-(--primary) transition-colors"
                >
                  <FiChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MediaItemsList;

// -----------------------------------------
// Universal MediaPreview Component
// -----------------------------------------
const MediaPreview = ({ type, icon, link, title }) => {
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const getFacebookVideoEmbed = (url) => {
    if (!url) return null;
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
      url,
    )}&show_text=false&width=200`;
  };

  const getInstagramEmbed = (url) => {
    if (!url) return null;

    if (url.includes("/p/")) {
      const shortcode = url.split("/p/")[1]?.split("/")[0];
      return shortcode
        ? `https://www.instagram.com/p/${shortcode}/embed`
        : null;
    }

    if (url.includes("/reel/")) {
      const shortcode = url.split("/reel/")[1]?.split("/")[0];
      return shortcode
        ? `https://www.instagram.com/reel/${shortcode}/embed`
        : null;
    }

    return null;
  };

  if (type === "image" && icon) {
    return (
      <CommonImage
        src={icon.startsWith("http") ? icon : `http://localhost:5000${icon}`}
        alt={title}
        className="w-32 h-20 object-cover rounded-lg border"
      />
    );
  }

  if (type === "video") {
    if (link) {
      const youtubeId = getYouTubeVideoId(link);
      if (youtubeId) {
        return (
          <iframe
            width="120"
            height="80"
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg border"
          />
        );
      }

      if (link.includes("facebook.com")) {
        const fbEmbed = getFacebookVideoEmbed(link);
        return (
          <iframe
            src={fbEmbed}
            width="120"
            height="80"
            style={{ border: "none", overflow: "hidden" }}
            scrolling="no"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            className="rounded-lg border"
          />
        );
      }

      if (link.includes("instagram.com")) {
        const igEmbed = getInstagramEmbed(link);
        if (igEmbed) {
          return (
            <iframe
              src={igEmbed}
              width="120"
              height="80"
              style={{ border: "none", overflow: "hidden" }}
              scrolling="no"
              frameBorder="0"
              allowFullScreen
              className="rounded-lg border"
            />
          );
        }
      }
    }

    if (icon) {
      return (
        <video
          src={icon.startsWith("http") ? icon : `http://localhost:5000${icon}`}
          controls
          className="w-32 h-20 object-cover rounded-lg border"
        />
      );
    }
  }

  return <span className="text-[10px] opacity-40">No media</span>;
};
