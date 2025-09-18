import { usePathname, useRouter } from "expo-router";
import {
    Coins,
    Home,
    MessageSquare,
    Mic,
    Phone,
    Shield,
    Sparkles,
    Star,
    Target,
    User,
    Users,
    Watch,
} from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface MagicalLayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  { path: "/tabs", icon: Home, label: "Dashboard" },
  { path: "/tabs/credits", icon: Coins, label: "Credits" },
  { path: "/tabs/habits", icon: Target, label: "Habits" },
  { path: "/tabs/interact", icon: MessageSquare, label: "Kali" },
  { path: "/tabs/checkins", icon: Phone, label: "AI Calls" },
  { path: "/tabs/voice-store", icon: Mic, label: "Voices" },
  { path: "/tabs/human-call-program", icon: Users, label: "Human Calls" },
  { path: "/tabs/integrations", icon: Watch, label: "Wearables" },
  { path: "/tabs/privacy", icon: Shield, label: "Privacy" },
  { path: "/tabs/profile", icon: User, label: "Profile" },
];

export function MagicalLayout({ children }: MagicalLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logo}>
          <Star size={28} color="#3B82F6" />
        </View>
        <Text style={styles.title}>NorthernStar</Text>
      </View>

      {/* Ribbon (fixed top-right) */}
      <View style={styles.ribbon}>
        <Sparkles size={16} color="#fff" />
        <Text style={styles.creditsText}>150</Text>
      </View>

      {/* Screen content */}
      <View style={styles.content}>{children}</View>

      {/* Bottom nav */}
      <View style={styles.bottomNav}>
        {navigationItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const active = pathname === item.path;
          return (
            <TouchableOpacity
              key={item.path}
              style={[styles.navButton, active && styles.activeNav]}
              onPress={() => router.push(item.path)}
            >
              <Icon size={20} color={active ? "#fff" : "#6B7280"} />
              <Text style={[styles.navLabel, active && { color: "#fff" }]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  logo: {
    padding: 6,
    backgroundColor: "#DBEAFE",
    borderRadius: 20,
    marginRight: 8,
  },
  title: { fontSize: 20, fontWeight: "bold", color: "#1F2937" },
  ribbon: {
    position: "absolute",
    top: 12,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3B82F6",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  creditsText: { marginLeft: 4, color: "#fff", fontWeight: "600" },
  content: { flex: 1, padding: 16 },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#fff",
  },
  navButton: { alignItems: "center", flex: 1, paddingVertical: 6 },
  navLabel: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  activeNav: { backgroundColor: "#3B82F6", borderRadius: 8, paddingVertical: 6 },
});
