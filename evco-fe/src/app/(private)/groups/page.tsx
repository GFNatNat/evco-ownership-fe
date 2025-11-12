"use client";

import GroupList from "./components/GroupList";
import MemberTable from "./components/MemberTable";
import FundOverview from "./components/FundOverview";
import VotingSection from "./components/VotingSection";
import { useState } from "react";
import GroupManagementAdvanced from "@/app/(private)/groups/components/GroupManagementAdvanced";

export default function GroupsPage() {
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-cyan-400">Nhóm đồng sở hữu</h2>

      <GroupList onSelectGroup={setSelectedGroup} selectedGroup={selectedGroup} />

      {selectedGroup && (
        <>
          <MemberTable groupId={selectedGroup} />
          <FundOverview groupId={selectedGroup} />
          <VotingSection groupId={selectedGroup} />
          <GroupManagementAdvanced 
          groupId={selectedGroup}/>
        </>
      )}
    </div>
  );
}
